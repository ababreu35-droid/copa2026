import { useCallback, useEffect, useRef, useState } from "react";
import type { Group, WorldCupData } from "./types";
import { fetchLiveData, getStaticData } from "./api";
import Header from "./components/Header";
import GroupTabs from "./components/GroupTabs";
import StandingsTable from "./components/StandingsTable";
import MatchList from "./components/MatchList";
import ApiKeyModal from "./components/ApiKeyModal";

const REFRESH_INTERVAL_MS = 60_000; // 1 minuto

export default function App() {
  const [data, setData] = useState<WorldCupData>(getStaticData());
  const [selectedGroupId, setSelectedGroupId] = useState("A");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("wc2026_api_key") ?? "");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(
    async (key: string) => {
      if (!key) return;
      setLoading(true);
      setError(null);
      try {
        const live = await fetchLiveData(key);
        setData(live);
        setCountdown(REFRESH_INTERVAL_MS / 1000);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("403") || msg.includes("401")) {
          setError("Chave de API inválida. Verifique e tente novamente.");
        } else if (msg.includes("NO_API_KEY")) {
          setError(null);
        } else {
          setError(`Erro ao buscar dados ao vivo: ${msg}`);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Inicia/reinicia polling quando a apiKey muda
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    if (!apiKey) return;

    refresh(apiKey);

    timerRef.current = setInterval(() => refresh(apiKey), REFRESH_INTERVAL_MS);

    countdownRef.current = setInterval(() => {
      setCountdown((c) => (c <= 1 ? REFRESH_INTERVAL_MS / 1000 : c - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [apiKey, refresh]);

  function saveApiKey(key: string) {
    localStorage.setItem("wc2026_api_key", key);
    setApiKey(key);
    setShowModal(false);
  }

  function clearApiKey() {
    localStorage.removeItem("wc2026_api_key");
    setApiKey("");
    setData(getStaticData());
    setError(null);
  }

  const selectedGroup: Group | undefined = data.groups.find(
    (g) => g.id === selectedGroupId
  );

  return (
    <div className="app">
      <Header
        lastUpdated={data.lastUpdated}
        source={data.source}
        loading={loading}
        countdown={apiKey ? countdown : null}
        hasApiKey={!!apiKey}
        onLiveClick={() => setShowModal(true)}
        onClearApiKey={clearApiKey}
        onManualRefresh={() => refresh(apiKey)}
      />

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setShowModal(true)}>Corrigir chave</button>
        </div>
      )}

      <main className="main-content">
        <GroupTabs
          groups={data.groups}
          selectedId={selectedGroupId}
          onSelect={setSelectedGroupId}
        />

        {selectedGroup && (
          <div className="group-view">
            <div className="group-col">
              <h2 className="section-title">Classificação — {selectedGroup.name}</h2>
              <StandingsTable standings={selectedGroup.standings} />
              <p className="standings-note">
                1.° e 2.° de cada grupo + 8 melhores 3.° avançam para o mata-mata.
              </p>
            </div>

            <div className="group-col">
              <h2 className="section-title">Partidas — {selectedGroup.name}</h2>
              <MatchList matches={selectedGroup.matches} />
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <ApiKeyModal
          currentKey={apiKey}
          onSave={saveApiKey}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
