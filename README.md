# Consulta Medição Fiscal

Este é um projeto full-stack simples desenvolvido para consultar informações de pontos de medição fiscal. A aplicação permite que o usuário pesquise por uma UC (Unidade Consumidora) e retorna dados detalhados sobre ela (UF, Posto, Endereço IP e número do medidor instalado).

## Funcionalidades

- **Busca por UC:** O usuário digita o código da UC;
- **Tratamento de Erros:** O sistema avisa se a UC não for encontrada ou se houver erro na conexão;
- **Exibição de Dados:** Retorna UF, Posto, IP e Medidor referentes à UC buscada.

## Tecnologias Utilizadas

### Frontend
- **React.js** (Vite): Interface de usuário interativa;
- **CSS**: Estilização;
  
### Backend
- **Python**: Linguagem principal do servidor;
- **Flask**: Framework para criação da API;
- **Pandas**: Biblioteca para leitura e manipulação do arquivo de dados (`dados.csv`).

### Infraestrutura
- **Vercel**: Hospedagem do Frontend e Backend (via Serverless Functions).

A aplicação utiliza um arquivo CSV como base de dados e roda em arquitetura *Serverless* no Vercel.

## Rodar Localmente

### Pré-requisitos

- Node.js e npm instalados;
- Python 3.x instalado.

### Como executar

1. Clonar repositório:  

```
git clone https://github.com/aaaaline/consulta-medicao-fiscal.git
cd consulta-medicao-fiscal
```

2. Configurar o Backend (Python):

```
# Instalar as dependências
pip install -r requirements.txt

# Executar o servidor Flask
python api/busca.py
```

O servidor iniciará em http://localhost:5000.  

3. Configurar o Frontend (React):  

Abra um novo terminal na pasta do projeto:

```
# Instalar dependências do Node
npm install

# Rodar o projeto React
npm run dev
```
Acesse o link mostrado no terminal (http://localhost:5173).

Para rodar localmente, é importante verificar se o componente React (`Search.jsx`) está apontando para a URL correta do backend, pois, em produção (Vercel), são utilizados caminhos relativos.

```
 const response = await fetch(`/api/consulta?uc=${search}`);
```
   
## Deploy no Vercel

Este projeto está configurado para deploy automático no Vercel.  

1. O arquivo `vercel.json` na raiz redireciona as chamadas de `/api/` para o script Python.
2. O arquivo `requirements.txt` garante que o Vercel instale o Flask e o Pandas.
3. O arquivo `dados.csv` deve estar localizado dentro da pasta `api/` para ser acessível pela função serverless.

### Configuração do `vercel.json`

```
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/busca.py" }
  ]
}
```
