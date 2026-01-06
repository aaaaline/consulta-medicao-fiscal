from flask import Flask, jsonify, request
import pandas as pd
import os

app = Flask(__name__)

base_path = os.path.dirname(__file__)
csv_path = os.path.join(base_path, 'dados.csv')

df = None
load_error = None

try:
    cols = ['UF', 'POSTO', 'IP', 'UC', 'MEDIDOR']
    df = pd.read_csv(csv_path, sep=';', dtype=str, low_memory=False, usecols=cols)
    df['UC'] = df['UC'].str.strip()
except Exception as e:
    load_error = str(e)
    print(f"Erro ao carregar CSV: {load_error}")

@app.route('/api/consulta', methods=['GET'])
def consultar():
    if df is None:
        return jsonify({"erro": f"Erro interno: Falha ao carregar banco de dados. Detalhes: {load_error}"}), 500

    uc_query = request.args.get('uc')
    if not uc_query:
        return jsonify({"erro": "Parametro UC e obrigatorio"}), 400

    try:
        uc_query = uc_query.strip()
        
        resultado = df[df['UC'] == uc_query]
        
        if not resultado.empty:
            data = resultado.iloc[0].where(pd.notnull(resultado.iloc[0]), None).to_dict()
            return jsonify(data)
        
        return jsonify({"erro": "UC nao encontrada"}), 404
        
    except Exception as e:
        return jsonify({"erro": f"Erro durante a busca: {str(e)}"}), 500

# O Vercel precisa da variável 'app' exposta.
# O bloco abaixo só roda localmente.
if __name__ == '__main__':
    app.run(debug=True, port=5000)