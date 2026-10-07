import { Link, useParams } from 'react-router-dom';
import { useApi, useTeams, formatDate } from '../api.js';
import Loader from '../components/Loader.jsx';
import { NewsImage } from '../components/NewsCard.jsx';

export default function Article() {
  const { id } = useParams();
  const teams = useTeams();
  const { data, error } = useApi(`/news/${id}`);
  if (error || !data || !teams) return <Loader error={error} />;
  return (
    <article className="container article">
      <Link to="/news" className="more">← All news</Link>
      <span className="kicker">{data.category}</span>
      <h1>{data.title}</h1>
      <time>{formatDate(data.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</time>
      <NewsImage team={teams[data.teamId]} category={data.category} large />
      <p className="article__lead">{data.summary}</p>
      {data.body.map((para, i) => <p key={i}>{para}</p>)}
    </article>
  );
}
