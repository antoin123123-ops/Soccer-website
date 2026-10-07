import { Link } from 'react-router-dom';
import TeamBadge from './TeamBadge.jsx';

export default function StandingsTable({ rows, teams, compact = false }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th className="left">Team</th>
            <th>P</th>
            {!compact && (
              <>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
              </>
            )}
            <th>GD</th>
            <th>Pts</th>
            {!compact && <th>Form</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.teamId} className={r.position <= 4 ? 'zone-top' : r.position >= rows.length - 1 ? 'zone-bottom' : ''}>
              <td>{r.position}</td>
              <td className="left">
                <Link to={`/teams/${r.teamId}`} className="team-cell">
                  <TeamBadge team={teams[r.teamId]} size={26} />
                  <span>{compact ? teams[r.teamId].abbr : teams[r.teamId].name}</span>
                </Link>
              </td>
              <td>{r.played}</td>
              {!compact && (
                <>
                  <td>{r.won}</td>
                  <td>{r.drawn}</td>
                  <td>{r.lost}</td>
                  <td>{r.gf}</td>
                  <td>{r.ga}</td>
                </>
              )}
              <td>{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
              <td className="strong">{r.points}</td>
              {!compact && (
                <td>
                  <span className="form">
                    {r.form.map((f, i) => (
                      <span key={i} className={`form__dot form__dot--${f}`}>{f}</span>
                    ))}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
