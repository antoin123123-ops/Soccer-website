import { Link } from 'react-router-dom';
import { useApi, useTeams, formatDate, formatTime } from '../api.js';

export default function ScoreTicker() {
  const { data: league } = useApi('/league');
  const teams = useTeams();
  const prev = league ? league.currentMatchday - 1 : null;
  const { data: recent } = useApi(prev ? `/games?matchday=${prev}` : '/games?matchday=0');
  const { data: upcoming } = useApi(league ? `/games?matchday=${league.currentMatchday}&status=scheduled` : '/games?matchday=0');

  if (!teams || !recent || !upcoming) return <div className="ticker" />;
  const games = [...recent, ...upcoming];

  return (
    <div className="ticker">
      <div className="ticker__track">
        {games.map((g) => {
          const final = g.status === 'final';
          return (
            <Link to="/scores" key={g.id} className="ticker__game">
              <div className="ticker__status">{final ? 'FINAL' : `${formatDate(g.date)} · ${formatTime(g.date)}`}</div>
              {[
                [g.homeId, g.homeScore, g.awayScore],
                [g.awayId, g.awayScore, g.homeScore],
              ].map(([id, score, other]) => (
                <div key={id} className={`ticker__row ${final && score < other ? 'ticker__row--lost' : ''}`}>
                  <span>{teams[id].abbr}</span>
                  <span>{final ? score : ''}</span>
                </div>
              ))}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
