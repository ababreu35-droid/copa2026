import type { DataSource } from "../types";

interface HeaderProps {
  lastUpdated: Date;
  source: DataSource;
  loading: boolean;
  countdown: number | null;
  hasApiKey: boolean;
  onLiveClick: () => void;
  onClearApiKey: () => void;
  onManualRefresh: () => void;
}

export default function Header({
  lastUpdated,
  source,
  loading,
  countdown,
  hasApiKey,
  onLiveClick,
  onClearApiKey,
  onManualRefresh,
}: HeaderProps) {
  const timeStr = lastUpdated.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-title">
          <div className="trophy-icon">🏆</div>
          <div>
            <h1>Copa do Mundo 2026</h1>
            <p className="header-subtitle">EUA · Canadá · México · 11 jun – 19 jul</p>
          </div>
        </div>

        <div className="header-actions">
          {hasApiKey ? (
            <div className="live-status">
              <span className={`live-dot ${loading ? "pulse" : "active"}`} />
              <span className="live-label">
                {loading ? "Atualizando…" : `Ao vivo · próx. ${countdown}s`}
              </span>
              <button className="btn-ghost" onClick={onManualRefresh} title="Atualizar agora">
                ↻
              </button>
              <button className="btn-ghost" onClick={onClearApiKey} title="Desconectar">
                ✕
              </button>
            </div>
          ) : (
            <button className="btn-live" onClick={onLiveClick}>
              Ativar modo ao vivo
            </button>
          )}

          <div className="last-updated">
            {source === "static" ? "Dados de" : "Atualizado às"} {timeStr}
          </div>
        </div>
      </div>
    </header>
  );
}
