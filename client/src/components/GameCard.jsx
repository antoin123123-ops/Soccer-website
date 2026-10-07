import { Link } from 'react-router-dom';
import TeamBadge from './TeamBadge.jsx';
import { formatDate, formatTime } from '../api.js';

export default function GameCard({ game, teams }) {
  const final = game.status === 'final';
  const sides = [
    { id: game.homeId, score: game.homeScore, other: game.awayScore },
    { id: game.awayId, score: game.awayScore, other: game.homeScore },
  ];
  return (
    <article className="game-card">
      <header className="game-card__head">
        <span className={final ? 'pill pill--final' : 'pill'}>{final ? 'Final' : formatTime(game.date)}</span>
        <span>{formatDate(game.date)}</span>
      </header>
      {sides.map(({ id, score, other }) => (
        <Link key={id} to={`/teams/${id}`} className={`game-card__team ${final && score < other ? 'is-loser' : ''}`}>
          <TeamBadge team={teams[id]} size={36} />
          <span className="game-card__name">{teams[id].name}</span>
          <span className="game-card__score">{final ? score : ''}</span>
        </Link>
      ))}
      {final && game.events.length > 0 && (
        <ul className="game-card__events">
          {game.events.map((e, i) => (
            <li key={i}>
              <strong>{e.minute}'</strong> ⚽ {e.scorer} <span className="muted">({teams[e.teamId].abbr})</span>
              {e.assist && <span className="muted"> · ast. {e.assist}</span>}
            </li>
          ))}
        </ul>
      )}
      <footer className="game-card__venue">📍 {game.venue}</footer>
    </article>
  );
}
