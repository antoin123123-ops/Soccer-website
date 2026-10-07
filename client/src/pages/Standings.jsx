import { useApi, useTeams } from '../api.js';
import Loader from '../components/Loader.jsx';
import StandingsTable from '../components/StandingsTable.jsx';

export default function Standings() {
  const teams = useTeams();
  const { data, error } = useApi('/standings');
  if (error || !data || !teams) return <Loader error={error} />;
  return (
    <div className="container">
      <h1 className="page-title">Standings</h1>
      <div className="panel">
        <StandingsTable rows={data} teams={teams} />
        <div className="legend">
          <span><i className="legend__swatch legend__swatch--top" /> Champions Cup qualification</span>
          <span><i className="legend__swatch legend__swatch--bottom" /> Relegation</span>
        </div>
      </div>
    </div>
  );
}
