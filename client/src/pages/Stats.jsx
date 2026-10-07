import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, useTeams } from '../api.js';
import Loader from '../components/Loader.jsx';
import TeamBadge from '../components/TeamBadge.jsx';

const CATEGORIES = [
  { key: 'goals', label: 'Goals' },
  { key: 'assists', label: 'Assists' },
  { key: 'cleanSheets', label: 'Clean Sheets' },
  { key: 'apps', label: 'Appearances' },
];

export default function Stats() {
  const teams = useTeams();
  const [sort, setSort] = useState('goals');
  const { data, error } = useApi(`/players?sort=${sort}&limit=25`);

  return (
    <div className="container">
      <h1 className="page-title">Player Stats</h1>
      <div className="tabs">
        {CATEGORIES.map((c) => (
          <button key={c.key} className={`tabs__item ${sort === c.key ? 'is-active' : ''}`} onClick={() => setSort(c.key)}>
            {c.label}
          </button>
        ))}
      </div>
      {error || !data || !teams ? (
        <Loader error={error} />
      ) : (
        <div className="panel">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th><th className="left">Player</th><th className="left">Team</th><th>Pos</th><th>Apps</th><th>G</th><th>A</th><th>CS</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td className="left strong">{p.name}</td>
                    <td className="left">
                      <Link to={`/teams/${p.teamId}`} className="team-cell">
                        <TeamBadge team={teams[p.teamId]} size={24} /> {teams[p.teamId].abbr}
                      </Link>
                    </td>
                    <td>{p.position}</td>
                    {['apps', 'goals', 'assists', 'cleanSheets'].map((k) => (
                      <td key={k} className={k === sort ? 'strong highlight' : ''}>{p.stats[k]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
