import { Link } from 'react-router-dom';
import { useApi, useTeams, formatDate } from '../api.js';
import Loader from '../components/Loader.jsx';
import NewsCard, { NewsImage } from '../components/NewsCard.jsx';
import StandingsTable from '../components/StandingsTable.jsx';
import GameCard from '../components/GameCard.jsx';
import TeamBadge from '../components/TeamBadge.jsx';

export default function Home() {
  const teams = useTeams();
  const league = useApi('/league');
  const news = useApi('/news');
  const standings = useApi('/standings');
  const scorers = useApi('/players?sort=goals&limit=5');
  const assists = useApi('/players?sort=assists&limit=5');
  const md = league.data?.currentMatchday;
  const upcoming = useApi(md ? `/games?matchday=${md}` : '/games?matchday=0');

  const error = league.error || news.error || standings.error;
  if (error || !teams || !news.data || !standings.data || !league.data) return <Loader error={error} />;

  const [featured, ...rest] = news.data;
  const featuredTeam = teams[featured.teamId];

  return (
    <div className="container">
      <section className="hero">
        <Link to={`/news/${featured.id}`} className="hero__main">
          <NewsImage team={featuredTeam} category={featured.category} large />
          <div className="hero__caption">
            <span className="kicker">Top Story</span>
            <h1>{featured.title}</h1>
            <p>{featured.summary}</p>
          </div>
        </Link>
        <aside className="hero__side">
          <h2 className="section-title">Latest Headlines</h2>
          <ul className="headlines">
            {rest.map((a) => (
              <li key={a.id}>
                <Link to={`/news/${a.id}`}>
                  <span className="kicker">{a.category}</span>
                  {a.title}
                  <time>{formatDate(a.date, { month: 'short', day: 'numeric' })}</time>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section-title">Matchday {md} Fixtures</h2>
          <Link to="/scores" className="more">All scores →</Link>
        </div>
        {upcoming.data ? (
          <div className="grid grid--games">
            {upcoming.data.map((g) => <GameCard key={g.id} game={g} teams={teams} />)}
          </div>
        ) : (
          <Loader error={upcoming.error} />
        )}
      </section>

      <section className="section grid grid--split">
        <div className="panel">
          <div className="section__head">
            <h2 className="section-title">Standings</h2>
            <Link to="/standings" className="more">Full table →</Link>
          </div>
          <StandingsTable rows={standings.data} teams={teams} compact />
        </div>
        <div className="panel">
          <div className="section__head">
            <h2 className="section-title">Stat Leaders</h2>
            <Link to="/stats" className="more">All stats →</Link>
          </div>
          <div className="leaders">
            <LeaderList title="Goals" players={scorers.data} stat="goals" teams={teams} />
            <LeaderList title="Assists" players={assists.data} stat="assists" teams={teams} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section-title">More News</h2>
          <Link to="/news" className="more">All news →</Link>
        </div>
        <div className="grid grid--news">
          {rest.slice(0, 3).map((a) => <NewsCard key={a.id} article={a} teams={teams} />)}
        </div>
      </section>
    </div>
  );
}

function LeaderList({ title, players, stat, teams }) {
  if (!players) return <Loader />;
  const [first, ...others] = players;
  return (
    <div className="leader">
      <h3>{title}</h3>
      <div className="leader__top">
        <TeamBadge team={teams[first.teamId]} size={48} />
        <div>
          <div className="leader__name">{first.name}</div>
          <div className="muted">{teams[first.teamId].name} · {first.position}</div>
        </div>
        <div className="leader__value">{first.stats[stat]}</div>
      </div>
      <ol className="leader__list" start={2}>
        {others.map((p) => (
          <li key={p.id}>
            <span>{p.name} <span className="muted">{teams[p.teamId].abbr}</span></span>
            <strong>{p.stats[stat]}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
