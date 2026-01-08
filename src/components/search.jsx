import { useState } from 'react';

const Search = () => {
  const [equipe, setEquipe] = useState("");
  const [search, setSearch] = useState("");
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleDownload = () => {
    window.open('/api/download-logs', '_blank');
  };

  const handleSearch = async () => {
    const equipeTrim = equipe.trim();
    const ucTrim = search.trim();

    if (!equipeTrim) {
      setResultado({ erro: "Informe o prefixo da equipe." });
      return;
    }
    if (!ucTrim) {
      setResultado({ erro: "Informe a UC para consultar." });
      return;
    }

    setCarregando(true);
    setResultado(null);

    try {
      const ucParam = encodeURIComponent(ucTrim);
      const equipeParam = encodeURIComponent(equipeTrim);

      const response = await fetch(`/api/consulta?uc=${ucParam}&equipe=${equipeParam}`);
      const data = await response.json();

      if (response.ok) {
        setResultado(data);
      } else {
        setResultado({ erro: data.erro || "UC não encontrada." });
      }
    } catch (error) {
      setResultado({ erro: "Erro ao conectar com o servidor." });
    } finally {
      setCarregando(false);
    }
  };

  const handleReset = () => {
    setSearch("");
    setResultado(null);
    // mantém equipe para não precisar redigitar
  };

  const podeConsultar = equipe.trim().length > 0 && search.trim().length > 0;

  return (
    <div className="search">
      {/* Botão de download */}
      <div className="top-actions">
        <button
          onClick={handleDownload}
          className="download-btn"
          title="Baixar lista de UCs pesquisadas que não foram encontradas"
        >
          Baixar ucs_nao_encontradas.csv
        </button>
      </div>

      <p className="label">Informe o prefixo da equipe:</p>
      <input
        type="text"
        placeholder="Prefixo da Equipe"
        className="input"
        value={equipe}
        onChange={(e) => setEquipe(e.target.value)}
      />

      <p className="label">Digite o número da UC a ser consultada:</p>

      {(!resultado || resultado.erro) && (
        <div className="search-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Número da UC"
            className="input"
          />
          <button
            onClick={handleSearch}
            disabled={carregando || !podeConsultar}
            className="primary-btn"
            title={!podeConsultar ? "Preencha equipe e UC para consultar" : ""}
          >
            {carregando ? "Buscando..." : "Consultar"}
          </button>
        </div>
      )}

      {resultado && !resultado.erro && (
        <div className="resultado-container">
          <p><strong>UF:</strong> {resultado.UF}</p>
          <p><strong>Posto:</strong> {resultado.POSTO}</p>
          <p><strong>IP:</strong> {resultado.IP}</p>
          <p><strong>UC:</strong> {resultado.UC}</p>
          <p><strong>Medidor:</strong> {resultado.MEDIDOR}</p>

          <button onClick={handleReset} className="secondary-btn">
            Nova Pesquisa
          </button>
        </div>
      )}

      {resultado?.erro && (
        <div className="erro-container">
          <p className="erro-texto">{resultado.erro}</p>
          <button onClick={handleReset} className="danger-btn">
            Buscar nova UC
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;