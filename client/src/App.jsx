import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import ScoreTicker from './components/ScoreTicker.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Scores from './pages/Scores.jsx';
import Standings from './pages/Standings.jsx';
import Teams from './pages/Teams.jsx';
import TeamPage from './pages/TeamPage.jsx';
import Stats from './pages/Stats.jsx';
import News from './pages/News.jsx';
import Article from './pages/Article.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <ScoreTicker />
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamPage />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<Article />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
