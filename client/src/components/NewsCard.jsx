import { Link } from 'react-router-dom';
import { formatDate } from '../api.js';

export function NewsImage({ team, category, large = false }) {
  return (
    <div
      className={`news-img ${large ? 'news-img--large' : ''}`}
      style={team ? { background: `linear-gradient(135deg, ${team.primary}, ${team.secondary})` } : undefined}
    >
      <span className="news-img__abbr">{team?.abbr ?? 'PSL'}</span>
      <span className="news-img__cat">{category}</span>
    </div>
  );
}

export default function NewsCard({ article, teams }) {
  return (
    <Link to={`/news/${article.id}`} className="news-card">
      <NewsImage team={teams[article.teamId]} category={article.category} />
      <div className="news-card__body">
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <time>{formatDate(article.date, { month: 'long', day: 'numeric' })}</time>
      </div>
    </Link>
  );
}
