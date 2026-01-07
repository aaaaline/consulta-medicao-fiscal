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
            // const response = await fetch(`http://127.0.0.1:5000/api/consulta?uc=${search}`);
            const response = await fetch(`/api/consulta?uc=${search}`);
            const data = await response.json();

            if (response.ok) {
                setResultado(data);
            } else {
                setResultado({ erro: data.erro || "UC nao encontrada." });
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
    };

    return (
        <div className="search">
            <h2>Pesquisar:</h2>

            {(!resultado || resultado.erro) && (
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
            )}

            {resultado && !resultado.erro && (
                <div className="resultado-container" style={{ 
                    textAlign: 'left', 
                    padding: '15px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                }}>
                    <p><strong>UF:</strong> {resultado.UF}</p>
                    <p><strong>Posto:</strong> {resultado.POSTO}</p>
                    <p><strong>IP:</strong> {resultado.IP}</p>
                    <p><strong>UC:</strong> {resultado.UC}</p>
                    <p><strong>Medidor:</strong> {resultado.MEDIDOR}</p>
                    
                    <button onClick={handleReset} style={{ marginTop: '10px', backgroundColor: '#007bff', color: 'white' }}>
                        Nova Pesquisa
                    </button>
                </div>
            )}

            {resultado?.erro && (
                <div style={{ marginTop: '10px', padding: '15px', border: '1px solid red', borderRadius: '8px', backgroundColor: '#fff5f5' }}>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>{resultado.erro}</p>
                    <button onClick={handleReset} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                        Buscar nova UC
                    </button>
                </div>
            )}
        </div>
    );
};

export default Search;