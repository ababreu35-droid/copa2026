import type { Match } from "../types";

interface MatchListProps {
  matches: Match[];
}

function formatDate(utcDate: string): string {
  const d = new Date(utcDate);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Sao_Paulo",
  });
}

function formatTime(utcDate: string): string {
  const d = new Date(utcDate);
  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function MatchCard({ match }: { match: Match }) {
  const finished = match.status === "FINISHED";
  const live =
    match.status === "IN_PLAY" || match.status === "PAUSED";
  const hasScore = match.score.home !== null && match.score.away !== null;

  const homeWin = hasScore && match.score.home! > match.score.away!;
  const awayWin = hasScore && match.score.away! > match.score.home!;

  return (
    <div className={`match-card ${live ? "match-live" : ""}`}>
      {live && (
        <div className="match-live-badge">
          <span className="live-dot active" />
          {match.minute ? `${match.minute}'` : "AO VIVO"}
        </div>
      )}
      {!live && (
        <div className="match-date">
          {finished ? formatDate(match.utcDate) : `${formatDate(match.utcDate)} · ${formatTime(match.utcDate)}`}
        </div>
      )}

      <div className="match-row">
        <span className={`match-team ${homeWin ? "match-winner" : ""}`}>
          <span className="team-flag">{match.homeTeam.flag}</span>
          <span className="team-name-match">{match.homeTeam.name}</span>
          <span className="team-short-match">{match.homeTeam.shortName}</span>
        </span>

        <div className="match-score">
          {hasScore ? (
            <>
              <span className={homeWin ? "score-winner" : ""}>{match.score.home}</span>
              <span className="score-sep">–</span>
              <span className={awayWin ? "score-winner" : ""}>{match.score.away}</span>
            </>
          ) : (
            <span className="score-time">{formatTime(match.utcDate)}</span>
          )}
        </div>

        <span className={`match-team match-team-away ${awayWin ? "match-winner" : ""}`}>
          <span className="team-short-match">{match.awayTeam.shortName}</span>
          <span className="team-name-match">{match.awayTeam.name}</span>
          <span className="team-flag">{match.awayTeam.flag}</span>
        </span>
      </div>
    </div>
  );
}

export default function MatchList({ matches }: MatchListProps) {
  const rounds = [1, 2, 3];

  return (
    <div className="match-list">
      {rounds.map((round) => {
        const roundMatches = matches.filter((m) => m.matchday === round);
        return (
          <div key={round} className="match-round">
            <h3 className="round-title">Rodada {round}</h3>
            {roundMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
