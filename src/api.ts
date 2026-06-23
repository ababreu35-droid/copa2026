import type { Group, Match, MatchStatus, Standing, Team, WorldCupData } from "./types";
import { STATIC_GROUPS } from "./data";

const BASE_URL = "https://api.football-data.org/v4";

// Tenta detectar a chave da variável de ambiente do Vite
function getApiKey(): string {
  try {
    return (import.meta as { env?: { VITE_API_KEY?: string } }).env?.VITE_API_KEY ?? "";
  } catch {
    return "";
  }
}

async function apiFetch(path: string, apiKey: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Auth-Token": apiKey },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── NORMALIZAÇÃO ──────────────────────────────────────────────────────────

function normalizeTeam(t: {
  name?: string;
  shortName?: string;
  tla?: string;
  crest?: string;
  flag?: string;
}): Team {
  const name = t.name ?? t.shortName ?? "?";
  const shortName = t.tla ?? t.shortName ?? name.substring(0, 3).toUpperCase();
  return { name, shortName, flag: t.flag ?? "" };
}

function normalizeStatus(s: string): MatchStatus {
  const map: Record<string, MatchStatus> = {
    SCHEDULED: "SCHEDULED",
    TIMED: "TIMED",
    IN_PLAY: "IN_PLAY",
    PAUSED: "PAUSED",
    FINISHED: "FINISHED",
    SUSPENDED: "SUSPENDED",
    POSTPONED: "POSTPONED",
    CANCELLED: "CANCELLED",
  };
  return map[s] ?? "SCHEDULED";
}

function normalizeMatch(m: {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number;
  stage?: string;
  homeTeam: { name?: string; shortName?: string; tla?: string };
  awayTeam: { name?: string; shortName?: string; tla?: string };
  score?: {
    fullTime?: { home?: number | null; away?: number | null };
    regularTime?: { home?: number | null; away?: number | null };
  };
  minute?: number | null;
}): Match {
  const ft = m.score?.fullTime ?? m.score?.regularTime ?? {};
  return {
    id: m.id,
    utcDate: m.utcDate,
    status: normalizeStatus(m.status),
    matchday: m.matchday ?? 1,
    homeTeam: normalizeTeam(m.homeTeam),
    awayTeam: normalizeTeam(m.awayTeam),
    score: {
      home: ft.home ?? null,
      away: ft.away ?? null,
    },
    minute: m.minute ?? null,
  };
}

function normalizeStanding(s: {
  position: number;
  team: { name?: string; shortName?: string; tla?: string };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}): Standing {
  return {
    position: s.position,
    team: normalizeTeam(s.team),
    playedGames: s.playedGames,
    won: s.won,
    draw: s.draw,
    lost: s.lost,
    goalsFor: s.goalsFor,
    goalsAgainst: s.goalsAgainst,
    goalDifference: s.goalDifference,
    points: s.points,
    form: s.form,
  };
}

// ─── BUSCA DE DADOS ─────────────────────────────────────────────────────────

export async function fetchLiveData(apiKey: string): Promise<WorldCupData> {
  const key = apiKey || getApiKey();
  if (!key) throw new Error("NO_API_KEY");

  const [standingsRes, matchesRes] = await Promise.all([
    apiFetch("/competitions/WC/standings?season=2026", key),
    apiFetch("/competitions/WC/matches?season=2026&stage=GROUP_STAGE", key),
  ]);

  // Agrupa partidas por grupo
  const matchesByGroup: Record<string, Match[]> = {};
  for (const m of standingsRes.standings ?? []) {
    const gName: string = m.group ?? m.stage ?? "?";
    matchesByGroup[gName] = [];
  }
  for (const m of (matchesRes.matches ?? []) as Array<{
    id: number;
    utcDate: string;
    status: string;
    matchday?: number;
    group?: string;
    homeTeam: { name?: string; shortName?: string; tla?: string };
    awayTeam: { name?: string; shortName?: string; tla?: string };
    score?: { fullTime?: { home?: number | null; away?: number | null } };
    minute?: number | null;
  }>) {
    const g = m.group ?? "?";
    if (!matchesByGroup[g]) matchesByGroup[g] = [];
    matchesByGroup[g].push(normalizeMatch(m));
  }

  const groups: Group[] = (
    standingsRes.standings as Array<{
      stage: string;
      type: string;
      group: string;
      table: Array<{
        position: number;
        team: { name?: string; shortName?: string; tla?: string };
        playedGames: number;
        won: number;
        draw: number;
        lost: number;
        goalsFor: number;
        goalsAgainst: number;
        goalDifference: number;
        points: number;
        form?: string;
      }>;
    }>
  ).map((s, idx) => {
    const letter = String.fromCharCode(65 + idx); // A, B, C…
    const id = letter;
    return {
      id,
      name: `Grupo ${letter}`,
      standings: (s.table ?? []).map(normalizeStanding),
      matches: matchesByGroup[s.group] ?? matchesByGroup[s.stage] ?? [],
    };
  });

  return { groups, lastUpdated: new Date(), source: "live" };
}

export function getStaticData(): WorldCupData {
  return {
    groups: STATIC_GROUPS,
    lastUpdated: new Date("2026-06-19T14:30:00-03:00"),
    source: "static",
  };
}
