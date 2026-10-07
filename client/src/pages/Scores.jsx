import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi, useTeams } from '../api.js';
import Loader from '../components/Loader.jsx';
import GameCard from '../components/GameCard.jsx';

export default function Scores() {
  const teams = useTeams();
  const league = useApi('/league');
  const [params, setParams] = useSearchParams();
  const [md, setMd] = useState(Number(params.get('md')) || null);

  useEffect(() => {
    if (!md && league.data) setMd(league.data.currentMatchday);
  }, [md, league.data]);

  const games = useApi(md ? `/games?matchday=${md}` : '/games?matchday=0');

  if (league.error || !league.data || !teams) return <Loader error={league.error} />;

  const select = (n) => {
    setMd(n);
    setParams({ md: n });
  };

  return (
    <div className="container">
      <h1 className="page-title">Scores &amp; Schedule</h1>
      <div className="md-picker">
        <button disabled={md <= 1} onClick={() => select(md - 1)} aria-label="Previous matchday">‹</button>
        <div className="md-picker__list">
          {Array.from({ length: league.data.totalMatchdays }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`md-picker__item ${n === md ? 'is-active' : ''} ${n === league.data.currentMatchday ? 'is-current' : ''}`}
              onClick={() => select(n)}
            >
              <small>MD</small>
              {n}
            </button>
          ))}
        </div>
        <button disabled={md >= league.data.totalMatchdays} onClick={() => select(md + 1)} aria-label="Next matchday">›</button>
      </div>
      {games.data ? (
        <div className="grid grid--games">
          {games.data.map((g) => <GameCard key={g.id} game={g} teams={teams} />)}
        </div>
      ) : (
        <Loader error={games.error} />
      )}
    </div>
  );
}
