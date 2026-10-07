import { useParams } from 'react-router-dom';
import { useApi, useTeams } from '../api.js';
import Loader from '../components/Loader.jsx';
import TeamBadge from '../components/TeamBadge.jsx';
import GameCard from '../components/GameCard.jsx';

const ORDER = { GK: 0, DF: 1, MF: 2, FW: 3 };

export default function TeamPage() {
  const { id } = useParams();
  const teams = useTeams();
  const { data: team, error } = useApi(`/teams/${id}`);
  if (error || !team || !teams) return <Loader error={error} />;

  const s = team.standing;
  const results = team.games.filter((g) => g.status === 'final').slice(-3).reverse();
  const next = team.games.filter((g) => g.status === 'scheduled').slice(0, 3);
  const roster = [...team.roster].sort((a, b) => ORDER[a.position] - ORDER[b.position] || a.number - b.number);

  return (
    <>
      <section className="team-hero" style={{ background: `linear-gradient(120deg, ${team.primary} 55%, ${team.secondary})` }}>
        <div className="container team-hero__inner">
          <TeamBadge team={team} size={110} />
          <div>
            <h1>{team.name}</h1>
            <p>{team.stadium} · Founded {team.founded}</p>
          </div>
          <dl className="team-hero__stats">
            <div><dt>Position</dt><dd>{s.position}</dd></div>
            <div><dt>Record</dt><dd>{s.won}-{s.drawn}-{s.lost}</dd></div>
            <div><dt>Points</dt><dd>{s.points}</dd></div>
            <div><dt>GD</dt><dd>{s.gd > 0 ? `+${s.gd}` : s.gd}</dd></div>
          </dl>
        </div>
      </section>
      <div className="container">
        <section className="section">
          <h2 className="section-title">Recent Results</h2>
          <div className="grid grid--games">
            {results.map((g) => <GameCard key={g.id} game={g} teams={teams} />)}
          </div>
        </section>
        {next.length > 0 && (
          <section className="section">
            <h2 className="section-title">Upcoming</h2>
            <div className="grid grid--games">
              {next.map((g) => <GameCard key={g.id} game={g} teams={teams} />)}
            </div>
          </section>
        )}
        <section className="section panel">
          <h2 className="section-title">Roster</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th className="left">Player</th><th>Pos</th><th>Nat</th><th>Age</th><th>Apps</th><th>G</th><th>A</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((p) => (
                  <tr key={p.id}>
                    <td>{p.number}</td>
                    <td className="left strong">{p.name}</td>
                    <td>{p.position}</td>
                    <td>{p.nationality}</td>
                    <td>{p.age}</td>
                    <td>{p.stats.apps}</td>
                    <td>{p.stats.goals}</td>
                    <td>{p.stats.assists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
