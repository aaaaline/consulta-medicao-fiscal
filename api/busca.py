# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

base_path = os.path.dirname(__file__)
csv_path = os.path.join(base_path, 'dados.csv')
log_csv_path = os.path.join(base_path, 'ucs_nao_encontradas.csv') 

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
    try:
        novo_registro = pd.DataFrame({
            'uc_pesquisada': [uc],
            'data_pesquisa': [datetime.now().strftime('%d/%m/%Y %H:%M:%S')]
        })
        
        novo_registro.to_csv(log_csv_path, mode='a', index=False, sep=',', encoding='utf-8', header=False)
    except Exception as e:
        print(f"Erro ao salvar log: {e}")

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