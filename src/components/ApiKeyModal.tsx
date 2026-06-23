import { useState } from "react";

interface ApiKeyModalProps {
  currentKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

export default function ApiKeyModal({ currentKey, onSave, onClose }: ApiKeyModalProps) {
  const [key, setKey] = useState(currentKey);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(key.trim());
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ativar atualizações ao vivo</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p>
            Para receber placar em tempo real, conecte uma chave de API gratuita da{" "}
            <a href="https://www.football-data.org/client/register" target="_blank" rel="noreferrer">
              football-data.org
            </a>
            .
          </p>

          <ol className="modal-steps">
            <li>
              Acesse{" "}
              <a href="https://www.football-data.org/client/register" target="_blank" rel="noreferrer">
                football-data.org/client/register
              </a>
            </li>
            <li>Crie uma conta gratuita (leva menos de 1 minuto)</li>
            <li>Copie a chave de API do seu painel</li>
            <li>Cole abaixo e clique em Salvar</li>
          </ol>

          <form onSubmit={handleSubmit} className="modal-form">
            <label htmlFor="apikey">Chave de API</label>
            <input
              id="apikey"
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="ex: a1b2c3d4e5f6..."
              autoComplete="off"
              autoFocus
            />
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={!key.trim()}>
                Salvar e ativar
              </button>
            </div>
          </form>

          <p className="modal-note">
            A chave fica salva no seu navegador. O app atualiza automaticamente a cada 60 segundos.
          </p>
        </div>
      </div>
    </div>
  );
}
