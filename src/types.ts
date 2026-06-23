export interface Team {
  name: string;
  shortName: string;
  flag: string;
}

export interface Standing {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}

export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "SUSPENDED"
  | "POSTPONED"
  | "CANCELLED";

export interface Match {
  id: number | string;
  utcDate: string;
  status: MatchStatus;
  matchday: number;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    home: number | null;
    away: number | null;
  };
  minute?: number | null;
}

export interface Group {
  id: string;
  name: string;
  standings: Standing[];
  matches: Match[];
}

export type DataSource = "live" | "static";

export interface WorldCupData {
  groups: Group[];
  lastUpdated: Date;
  source: DataSource;
}
