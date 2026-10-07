import { useApi, useTeams } from '../api.js';
import Loader from '../components/Loader.jsx';
import NewsCard from '../components/NewsCard.jsx';

export default function News() {
  const teams = useTeams();
  const { data, error } = useApi('/news');
  if (error || !data || !teams) return <Loader error={error} />;
  return (
    <div className="container">
      <h1 className="page-title">News</h1>
      <div className="grid grid--news">
        {data.map((a) => <NewsCard key={a.id} article={a} teams={teams} />)}
      </div>
    </div>
  );
}
