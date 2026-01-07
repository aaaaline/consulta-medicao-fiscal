# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import os
import io
from datetime import datetime
from supabase import create_client

app = Flask(__name__)
CORS(app)

base_path = os.path.dirname(__file__)
csv_path = os.path.join(base_path, 'dados.csv')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SECRET_KEY")
supabase = create_client(url, key)

df = None
load_error = None

# Carregamento do banco de dados principal
try:
    cols = ['UF', 'POSTO', 'IP', 'UC', 'MEDIDOR']
    df = pd.read_csv(csv_path, sep=';', dtype=str, low_memory=False, usecols=cols)
    df['UC'] = df['UC'].str.strip()
except Exception as e:
    load_error = str(e)
    print(f"Erro ao carregar CSV principal: {load_error}")

def registrar_uc_nao_encontrada(uc):
    # Em vez de salvar no CSV local que some
    data = {
        "uc_pesquisada": uc,
        "data_pesquisa": datetime.now().isoformat()
    }
    # salva as ucs no banco de dados do supabase, que está integrado ao vercel
    supabase.table("ucs_nao_encontradas").insert(data).execute()

@app.route('/api/consulta', methods=['GET'])
def consultar():
    if df is None:
        return jsonify({"erro": f"Erro interno no banco de dados: {load_error}"}), 500

    uc_query = request.args.get('uc')
    if not uc_query:
        return jsonify({"erro": "Parametro UC e obrigatorio"}), 400

    try:
        uc_query = uc_query.strip()
        resultado = df[df['UC'] == uc_query]
        
        if not resultado.empty:
            data = resultado.iloc[0].where(pd.notnull(resultado.iloc[0]), None).to_dict()
            return jsonify(data)
        
        registrar_uc_nao_encontrada(uc_query)
        return jsonify({"erro": "UC nao encontrada"}), 404
        
    except Exception as e:
        return jsonify({"erro": f"Erro durante a busca: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)