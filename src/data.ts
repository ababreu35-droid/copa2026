import type { Group, Match, Standing, Team } from "./types";

function team(name: string, shortName: string, flag: string): Team {
  return { name, shortName, flag };
}

function sched(
  id: string,
  utcDate: string,
  matchday: number,
  home: Team,
  away: Team,
  homeScore: number | null,
  awayScore: number | null
): Match {
  const finished = homeScore !== null && awayScore !== null;
  return {
    id,
    utcDate,
    status: finished ? "FINISHED" : "SCHEDULED",
    matchday,
    homeTeam: home,
    awayTeam: away,
    score: { home: homeScore, away: awayScore },
  };
}

type RawStanding = [Team, number, number, number, number, number, number];

function buildStanding(
  pos: number,
  [team, pts, j, v, e, d, gp, gc]: [...RawStanding, number]
): Standing {
  return {
    position: pos,
    team,
    playedGames: j,
    won: v,
    draw: e,
    lost: d,
    goalsFor: gp,
    goalsAgainst: gc,
    goalDifference: gp - gc,
    points: pts,
  };
}

// ─── SELEÇÕES ──────────────────────────────────────────────────────────────

const MEX = team("México", "MEX", "🇲🇽");
const KOR = team("Coreia do Sul", "KOR", "🇰🇷");
const CZE = team("Tchéquia", "CZE", "🇨🇿");
const RSA = team("África do Sul", "RSA", "🇿🇦");

const CAN = team("Canadá", "CAN", "🇨🇦");
const SUI = team("Suíça", "SUI", "🇨🇭");
const BIH = team("Bósnia", "BIH", "🇧🇦");
const QAT = team("Catar", "QAT", "🇶🇦");

const BRA = team("Brasil", "BRA", "🇧🇷");
const MAR = team("Marrocos", "MAR", "🇲🇦");
const SCO = team("Escócia", "SCO", "🏴󠁧󠁢󠁳󠁣󠁴󠁿");
const HAI = team("Haiti", "HAI", "🇭🇹");

const USA = team("Estados Unidos", "USA", "🇺🇸");
const AUS = team("Austrália", "AUS", "🇦🇺");
const PAR = team("Paraguai", "PAR", "🇵🇾");
const TUR = team("Turquia", "TUR", "🇹🇷");

const GER = team("Alemanha", "GER", "🇩🇪");
const CIV = team("C. do Marfim", "CIV", "🇨🇮");
const ECU = team("Equador", "ECU", "🇪🇨");
const CUW = team("Curaçao", "CUW", "🇨🇼");

const NED = team("Países Baixos", "NED", "🇳🇱");
const SWE = team("Suécia", "SWE", "🇸🇪");
const JPN = team("Japão", "JPN", "🇯🇵");
const TUN = team("Tunísia", "TUN", "🇹🇳");

const BEL = team("Bélgica", "BEL", "🇧🇪");
const EGY = team("Egito", "EGY", "🇪🇬");
const IRN = team("Irã", "IRN", "🇮🇷");
const NZL = team("Nova Zelândia", "NZL", "🇳🇿");

const ESP = team("Espanha", "ESP", "🇪🇸");
const CPV = team("Cabo Verde", "CPV", "🇨🇻");
const KSA = team("Arábia Saudita", "KSA", "🇸🇦");
const URU = team("Uruguai", "URU", "🇺🇾");

const FRA = team("França", "FRA", "🇫🇷");
const SEN = team("Senegal", "SEN", "🇸🇳");
const IRQ = team("Iraque", "IRQ", "🇮🇶");
const NOR = team("Noruega", "NOR", "🇳🇴");

const ARG = team("Argentina", "ARG", "🇦🇷");
const ALG = team("Argélia", "ALG", "🇩🇿");
const AUT = team("Áustria", "AUT", "🇦🇹");
const JOR = team("Jordânia", "JOR", "🇯🇴");

const POR = team("Portugal", "POR", "🇵🇹");
const COD = team("RD Congo", "COD", "🇨🇩");
const UZB = team("Uzbequistão", "UZB", "🇺🇿");
const COL = team("Colômbia", "COL", "🇨🇴");

const ENG = team("Inglaterra", "ENG", "🏴󠁧󠁢󠁥󠁮󠁧󠁿");
const CRO = team("Croácia", "CRO", "🇭🇷");
const GHA = team("Gana", "GHA", "🇬🇭");
const PAN = team("Panamá", "PAN", "🇵🇦");

// ─── GRUPOS ────────────────────────────────────────────────────────────────

export const STATIC_GROUPS: Group[] = [
  {
    id: "A",
    name: "Grupo A",
    standings: [
      buildStanding(1, [MEX, 6, 2, 2, 0, 0, 3, 0, 3]),
      buildStanding(2, [KOR, 3, 2, 1, 0, 1, 2, 2, 2]),
      buildStanding(3, [CZE, 1, 2, 0, 1, 1, 2, 4, 3]),
      buildStanding(4, [RSA, 1, 2, 0, 1, 1, 1, 3, 1]),
    ],
    matches: [
      sched("A1", "2026-06-11T19:00:00Z", 1, MEX, RSA, 2, 0),
      sched("A2", "2026-06-11T02:00:00Z", 1, KOR, CZE, 2, 1),
      sched("A3", "2026-06-18T17:00:00Z", 2, CZE, RSA, 1, 1),
      sched("A4", "2026-06-19T01:00:00Z", 2, MEX, KOR, 1, 0),
      sched("A5", "2026-06-25T01:00:00Z", 3, CZE, MEX, null, null),
      sched("A6", "2026-06-25T01:00:00Z", 3, RSA, KOR, null, null),
    ],
  },
  {
    id: "B",
    name: "Grupo B",
    standings: [
      buildStanding(1, [CAN, 4, 2, 1, 1, 0, 7, 1, 6]),
      buildStanding(2, [SUI, 4, 2, 1, 1, 0, 5, 2, 5]),
      buildStanding(3, [BIH, 1, 2, 0, 1, 1, 2, 5, 2]),
      buildStanding(4, [QAT, 1, 2, 0, 1, 1, 1, 7, 1]),
    ],
    matches: [
      sched("B1", "2026-06-12T19:00:00Z", 1, CAN, BIH, 1, 1),
      sched("B2", "2026-06-13T19:00:00Z", 1, QAT, SUI, 1, 1),
      sched("B3", "2026-06-18T21:00:00Z", 2, SUI, BIH, 4, 1),
      sched("B4", "2026-06-18T00:00:00Z", 2, CAN, QAT, 6, 0),
      sched("B5", "2026-06-24T21:00:00Z", 3, SUI, CAN, null, null),
      sched("B6", "2026-06-24T21:00:00Z", 3, BIH, QAT, null, null),
    ],
  },
  {
    id: "C",
    name: "Grupo C",
    standings: [
      buildStanding(1, [SCO, 3, 1, 1, 0, 0, 1, 0, 1]),
      buildStanding(2, [BRA, 1, 1, 0, 1, 0, 1, 1, 1]),
      buildStanding(3, [MAR, 1, 1, 0, 1, 0, 1, 1, 1]),
      buildStanding(4, [HAI, 0, 1, 0, 0, 1, 0, 1, 0]),
    ],
    matches: [
      sched("C1", "2026-06-13T23:00:00Z", 1, BRA, MAR, 1, 1),
      sched("C2", "2026-06-14T01:00:00Z", 1, HAI, SCO, 0, 1),
      sched("C3", "2026-06-19T22:00:00Z", 2, SCO, MAR, null, null),
      sched("C4", "2026-06-20T00:30:00Z", 2, BRA, HAI, null, null),
      sched("C5", "2026-06-25T00:00:00Z", 3, SCO, BRA, null, null),
      sched("C6", "2026-06-25T00:00:00Z", 3, MAR, HAI, null, null),
    ],
  },
  {
    id: "D",
    name: "Grupo D",
    standings: [
      buildStanding(1, [USA, 3, 1, 1, 0, 0, 4, 1, 4]),
      buildStanding(2, [AUS, 3, 1, 1, 0, 0, 2, 0, 2]),
      buildStanding(3, [PAR, 0, 1, 0, 0, 1, 1, 4, 1]),
      buildStanding(4, [TUR, 0, 1, 0, 0, 1, 0, 2, 0]),
    ],
    matches: [
      sched("D1", "2026-06-12T22:00:00Z", 1, USA, PAR, 4, 1),
      sched("D2", "2026-06-13T03:00:00Z", 1, AUS, TUR, 2, 0),
      sched("D3", "2026-06-19T21:00:00Z", 2, USA, AUS, null, null),
      sched("D4", "2026-06-20T22:00:00Z", 2, TUR, PAR, null, null),
      sched("D5", "2026-06-25T23:00:00Z", 3, USA, TUR, null, null),
      sched("D6", "2026-06-26T01:30:00Z", 3, PAR, AUS, null, null),
    ],
  },
  {
    id: "E",
    name: "Grupo E",
    standings: [
      buildStanding(1, [GER, 3, 1, 1, 0, 0, 7, 1, 7]),
      buildStanding(2, [CIV, 3, 1, 1, 0, 0, 1, 0, 1]),
      buildStanding(3, [ECU, 0, 1, 0, 0, 1, 0, 1, 0]),
      buildStanding(4, [CUW, 0, 1, 0, 0, 1, 1, 7, 1]),
    ],
    matches: [
      sched("E1", "2026-06-14T17:00:00Z", 1, GER, CUW, 7, 1),
      sched("E2", "2026-06-15T01:00:00Z", 1, CIV, ECU, 1, 0),
      sched("E3", "2026-06-20T22:00:00Z", 2, GER, CIV, null, null),
      sched("E4", "2026-06-21T02:00:00Z", 2, ECU, CUW, null, null),
      sched("E5", "2026-06-25T22:00:00Z", 3, ECU, GER, null, null),
      sched("E6", "2026-06-25T22:00:00Z", 3, CUW, CIV, null, null),
    ],
  },
  {
    id: "F",
    name: "Grupo F",
    standings: [
      buildStanding(1, [SWE, 3, 1, 1, 0, 0, 5, 1, 5]),
      buildStanding(2, [NED, 1, 1, 0, 1, 0, 2, 2, 2]),
      buildStanding(3, [JPN, 1, 1, 0, 1, 0, 2, 2, 2]),
      buildStanding(4, [TUN, 0, 1, 0, 0, 1, 1, 5, 1]),
    ],
    matches: [
      sched("F1", "2026-06-14T20:00:00Z", 1, NED, JPN, 2, 2),
      sched("F2", "2026-06-15T04:00:00Z", 1, SWE, TUN, 5, 1),
      sched("F3", "2026-06-20T19:00:00Z", 2, NED, SWE, null, null),
      sched("F4", "2026-06-21T06:00:00Z", 2, TUN, JPN, null, null),
      sched("F5", "2026-06-26T01:00:00Z", 3, JPN, SWE, null, null),
      sched("F6", "2026-06-26T01:00:00Z", 3, TUN, NED, null, null),
    ],
  },
  {
    id: "G",
    name: "Grupo G",
    standings: [
      buildStanding(1, [NZL, 1, 1, 0, 1, 0, 2, 2, 2]),
      buildStanding(2, [IRN, 1, 1, 0, 1, 0, 2, 2, 2]),
      buildStanding(3, [BEL, 1, 1, 0, 1, 0, 1, 1, 1]),
      buildStanding(4, [EGY, 1, 1, 0, 1, 0, 1, 1, 1]),
    ],
    matches: [
      sched("G1", "2026-06-15T21:00:00Z", 1, BEL, EGY, 1, 1),
      sched("G2", "2026-06-16T01:00:00Z", 1, IRN, NZL, 2, 2),
      sched("G3", "2026-06-21T21:00:00Z", 2, BEL, IRN, null, null),
      sched("G4", "2026-06-22T03:00:00Z", 2, NZL, EGY, null, null),
      sched("G5", "2026-06-28T05:00:00Z", 3, EGY, IRN, null, null),
      sched("G6", "2026-06-28T05:00:00Z", 3, NZL, BEL, null, null),
    ],
  },
  {
    id: "H",
    name: "Grupo H",
    standings: [
      buildStanding(1, [ESP, 1, 1, 0, 1, 0, 0, 0, 0]),
      buildStanding(2, [CPV, 1, 1, 0, 1, 0, 0, 0, 0]),
      buildStanding(3, [KSA, 1, 1, 0, 1, 0, 1, 1, 1]),
      buildStanding(4, [URU, 1, 1, 0, 1, 0, 1, 1, 1]),
    ],
    matches: [
      sched("H1", "2026-06-15T18:00:00Z", 1, ESP, CPV, 0, 0),
      sched("H2", "2026-06-16T00:00:00Z", 1, KSA, URU, 1, 1),
      sched("H3", "2026-06-21T18:00:00Z", 2, ESP, KSA, null, null),
      sched("H4", "2026-06-22T00:00:00Z", 2, URU, CPV, null, null),
      sched("H5", "2026-06-27T02:00:00Z", 3, CPV, KSA, null, null),
      sched("H6", "2026-06-27T02:00:00Z", 3, URU, ESP, null, null),
    ],
  },
  {
    id: "I",
    name: "Grupo I",
    standings: [
      buildStanding(1, [NOR, 3, 1, 1, 0, 0, 4, 1, 4]),
      buildStanding(2, [FRA, 3, 1, 1, 0, 0, 3, 1, 3]),
      buildStanding(3, [SEN, 0, 1, 0, 0, 1, 1, 3, 1]),
      buildStanding(4, [IRQ, 0, 1, 0, 0, 1, 1, 4, 1]),
    ],
    matches: [
      sched("I1", "2026-06-16T21:00:00Z", 1, FRA, SEN, 3, 1),
      sched("I2", "2026-06-17T01:00:00Z", 1, IRQ, NOR, 1, 4),
      sched("I3", "2026-06-22T23:00:00Z", 2, FRA, IRQ, null, null),
      sched("I4", "2026-06-23T02:00:00Z", 2, NOR, SEN, null, null),
      sched("I5", "2026-06-27T21:00:00Z", 3, SEN, IRQ, null, null),
      sched("I6", "2026-06-27T21:00:00Z", 3, NOR, FRA, null, null),
    ],
  },
  {
    id: "J",
    name: "Grupo J",
    standings: [
      buildStanding(1, [ARG, 3, 1, 1, 0, 0, 3, 0, 3]),
      buildStanding(2, [AUT, 3, 1, 1, 0, 0, 3, 1, 3]),
      buildStanding(3, [JOR, 0, 1, 0, 0, 1, 1, 3, 1]),
      buildStanding(4, [ALG, 0, 1, 0, 0, 1, 0, 3, 0]),
    ],
    matches: [
      sched("J1", "2026-06-17T01:00:00Z", 1, ARG, ALG, 3, 0),
      sched("J2", "2026-06-17T06:00:00Z", 1, AUT, JOR, 3, 1),
      sched("J3", "2026-06-22T19:00:00Z", 2, ARG, AUT, null, null),
      sched("J4", "2026-06-23T05:00:00Z", 2, JOR, ALG, null, null),
      sched("J5", "2026-06-28T04:00:00Z", 3, ALG, AUT, null, null),
      sched("J6", "2026-06-28T04:00:00Z", 3, JOR, ARG, null, null),
    ],
  },
  {
    id: "K",
    name: "Grupo K",
    standings: [
      buildStanding(1, [COL, 3, 1, 1, 0, 0, 3, 1, 3]),
      buildStanding(2, [POR, 1, 1, 0, 1, 0, 1, 1, 1]),
      buildStanding(3, [COD, 1, 1, 0, 1, 0, 1, 1, 1]),
      buildStanding(4, [UZB, 0, 1, 0, 0, 1, 1, 3, 1]),
    ],
    matches: [
      sched("K1", "2026-06-17T19:00:00Z", 1, POR, COD, 1, 1),
      sched("K2", "2026-06-18T04:00:00Z", 1, UZB, COL, 1, 3),
      sched("K3", "2026-06-23T19:00:00Z", 2, POR, UZB, null, null),
      sched("K4", "2026-06-24T04:00:00Z", 2, COL, COD, null, null),
      sched("K5", "2026-06-28T01:30:00Z", 3, COL, POR, null, null),
      sched("K6", "2026-06-28T01:30:00Z", 3, COD, UZB, null, null),
    ],
  },
  {
    id: "L",
    name: "Grupo L",
    standings: [
      buildStanding(1, [ENG, 3, 1, 1, 0, 0, 4, 2, 4]),
      buildStanding(2, [GHA, 3, 1, 1, 0, 0, 1, 0, 1]),
      buildStanding(3, [CRO, 0, 1, 0, 0, 1, 2, 4, 2]),
      buildStanding(4, [PAN, 0, 1, 0, 0, 1, 0, 1, 0]),
    ],
    matches: [
      sched("L1", "2026-06-17T19:00:00Z", 1, ENG, CRO, 4, 2),
      sched("L2", "2026-06-18T01:00:00Z", 1, GHA, PAN, 1, 0),
      sched("L3", "2026-06-23T22:00:00Z", 2, ENG, GHA, null, null),
      sched("L4", "2026-06-24T02:00:00Z", 2, PAN, CRO, null, null),
      sched("L5", "2026-06-27T23:00:00Z", 3, CRO, GHA, null, null),
      sched("L6", "2026-06-27T23:00:00Z", 3, PAN, ENG, null, null),
    ],
  },
];
