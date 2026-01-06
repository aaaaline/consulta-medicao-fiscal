import { useState } from 'react';

const Search = () => {
    const [search, setSearch] = useState("");
    const [resultado, setResultado] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const handleSearch = async () => {
        if (!search) return;
        
        setCarregando(true);
        setResultado(null);

        try {
            const response = await fetch(`/api/consulta?uc=${search}`);
            const data = await response.json();

            if (response.ok) {
                setResultado(data);
            } else {
                setResultado({ erro: data.erro || "UC não encontrada." });
            }
        } catch (error) {
            setResultado({ erro: "Erro ao conectar com o servidor Python." });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="search">
            <h2>Pesquisar:</h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    type="text" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Digite a UC a ser pesquisada."
                    style={{ flex: 1, padding: '8px' }}
                />
                <button onClick={handleSearch} disabled={carregando}>
                    {carregando ? "Buscando..." : "Consultar"}
                </button>
            </div>

            {/* Exibição dos resultados baseada nas colunas do seu CSV */}
            {resultado && !resultado.erro && (
                <div className="resultado-container" style={{ 
                    textAlign: 'left', 
                    padding: '15px', 
                    backgroundColor: '#fff', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                }}>
                    <p><strong>UF:</strong> {resultado.UF}</p>
                    <p><strong>Posto:</strong> {resultado.POSTO}</p>
                    <p><strong>IP:</strong> {resultado.IP}</p>
                    <p><strong>UC:</strong> {resultado.UC}</p>
                    <p><strong>Medidor:</strong> {resultado.MEDIDOR}</p>
                </div>
            )}

            {resultado?.erro && (
                <p style={{ color: 'red', fontWeight: 'bold' }}>{resultado.erro}</p>
            )}
        </div>
    );
};

export default Search;