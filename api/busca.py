# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Localização do arquivo
base_path = os.path.dirname(os.path.dirname(__file__))
csv_path = os.path.join(base_path, 'dados.csv')

try:
    cols = ['UF', 'POSTO', 'IP', 'UC', 'MEDIDOR']
    df = pd.read_csv(csv_path, sep=';', dtype=str, low_memory=False, usecols=cols)
except Exception as e:
    print(f"Erro ao carregar CSV: {e}")

@app.route('/api/consulta', methods=['GET'])
def consultar():
    uc_query = request.args.get('uc')
    if not uc_query:
        return jsonify({"erro": "Parametro UC e obrigatorio"}), 400

    # Busca a UC
    resultado = df[df['UC'] == uc_query]
    
    if not resultado.empty:
        return jsonify(resultado.iloc[0].to_dict())
    
    return jsonify({"erro": "UC nao encontrada"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)