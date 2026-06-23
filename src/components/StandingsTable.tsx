import type { Standing } from "../types";

interface StandingsTableProps {
  standings: Standing[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="standings-wrapper">
      <table className="standings-table">
        <thead>
          <tr>
            <th className="col-pos">Pos</th>
            <th className="col-team">Seleção</th>
            <th title="Jogos">J</th>
            <th title="Vitórias">V</th>
            <th title="Empates">E</th>
            <th title="Derrotas">D</th>
            <th title="Gols marcados">GP</th>
            <th title="Gols sofridos">GC</th>
            <th title="Saldo de gols">SG</th>
            <th title="Pontos" className="col-pts">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, idx) => (
            <tr
              key={s.team.shortName}
              className={
                idx < 2 ? "row-qualified" : idx === 2 ? "row-possible" : "row-out"
              }
            >
              <td className="col-pos">
                <span className={`pos-badge pos-${idx + 1}`}>{idx + 1}</span>
              </td>
              <td className="col-team">
                <span className="team-flag">{s.team.flag}</span>
                <span className="team-name">{s.team.name}</span>
                <span className="team-short">{s.team.shortName}</span>
              </td>
              <td>{s.playedGames}</td>
              <td>{s.won}</td>
              <td>{s.draw}</td>
              <td>{s.lost}</td>
              <td>{s.goalsFor}</td>
              <td>{s.goalsAgainst}</td>
              <td className={s.goalDifference > 0 ? "sg-pos" : s.goalDifference < 0 ? "sg-neg" : ""}>
                {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
              </td>
              <td className="col-pts">
                <strong>{s.points}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
