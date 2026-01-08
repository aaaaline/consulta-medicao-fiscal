# Consulta Medição Fiscal

Este é um projeto full-stack simples desenvolvido para consultar informações de pontos de medição fiscal. A aplicação permite que o usuário pesquise por uma UC (Unidade Consumidora) e retorna dados detalhados sobre ela (UF, Posto, Endereço IP e número do medidor instalado).  

Além da consulta, o sistema registra, em um banco de dados, para controle posterior, as UCs não encontradas.  

## Funcionalidades

- **Busca por UC**: O usuário informa o prefixo da equipe e o código da UC;
- **Tratamento de Erros**: O sistema avisa se a UC não for encontrada, se houver erro na conexão ou se campos obrigatórios não forem preenchidos;
- **Registro de Logs**: Caso a UC não seja encontrada, o sistema salva automaticamente o evento (Equipe, UC e Data) em um banco de dados;
- **Download de Relatório**: Permite baixar um arquivo CSV (`ucs_nao_encontradas.csv`), que contém o histórico de UCs pesquisadas que não constavam na base;
- **Exibição de Dados**: Retorna UF, Posto, IP e Medidor referentes à UC buscada.

## Tecnologias Utilizadas

### Frontend
- **React.js** (Vite): Interface de usuário interativa;
- **CSS**: Estilização com design responsivo;
  
### Backend
- **Python**: Linguagem principal do servidor;
- **Flask**: Framework para criação da API;
- **Pandas**: Leitura e manipulação do arquivo de dados (`dados.csv`) e geração de logs;
- **Supabase**: Banco de dados para registro das UCs não encontradas.

### Infraestrutura
- **Vercel**: Hospedagem do Frontend e Backend (via Serverless Functions).

A aplicação utiliza um arquivo CSV como base de dados e roda em arquitetura *Serverless* no Ver
   
## Deploy no Vercel

Este projeto está configurado para deploy automático no Vercel.  

1. O arquivo `vercel.json` na raiz redireciona as chamadas de `/api/` para o script Python.
2. É necessário adicionar as variáveis de ambiente (SUPABASE_URL e SUPABASE_SECRET_KEY) nas configurações do projeto no painel da Vercel.
3. O arquivo `dados.csv` deve estar localizado dentro da pasta `api/` para ser acessível pela função serverless.

### Configuração do `vercel.json`

```
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/busca.py" }
  ]
}
```
