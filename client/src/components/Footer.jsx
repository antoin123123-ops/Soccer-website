import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <div className="logo logo--footer">
            <span className="logo__mark">⚽</span>
            <span className="logo__text">PSL</span>
          </div>
          <p className="footer__note">Premier Soccer League is a fictional league. All teams, players and results are generated demo data.</p>
        </div>
        <div className="footer__links">
          <Link to="/scores">Scores</Link>
          <Link to="/standings">Standings</Link>
          <Link to="/teams">Teams</Link>
          <Link to="/stats">Stats</Link>
          <Link to="/news">News</Link>
        </div>
      </div>
      <div className="footer__bottom">© {new Date().getFullYear()} Premier Soccer League</div>
    </footer>
  );
}
