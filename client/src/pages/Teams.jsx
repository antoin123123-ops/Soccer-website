import { Link } from 'react-router-dom';
import { useApi } from '../api.js';
import Loader from '../components/Loader.jsx';
import TeamBadge from '../components/TeamBadge.jsx';

export default function Teams() {
  const { data, error } = useApi('/teams');
  if (error || !data) return <Loader error={error} />;
  return (
    <div className="container">
      <h1 className="page-title">Teams</h1>
      <div className="grid grid--teams">
        {data.map((t) => (
          <Link key={t.id} to={`/teams/${t.id}`} className="team-tile" style={{ '--team': t.primary }}>
            <TeamBadge team={t} size={64} />
            <div>
              <h3>{t.name}</h3>
              <p className="muted">{t.stadium} · Est. {t.founded}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
