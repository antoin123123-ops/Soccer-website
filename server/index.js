import express from 'express';
import cors from 'cors';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { LEAGUE, teams, players, games, news, getStandings, currentMatchday } from './data.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const api = express.Router();

api.get('/league', (req, res) => {
  res.json({ ...LEAGUE, currentMatchday: currentMatchday(), totalMatchdays: games.at(-1).matchday });
});

api.get('/teams', (req, res) => res.json(teams));

api.get('/teams/:id', (req, res) => {
  const team = teams.find((t) => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  res.json({
    ...team,
    standing: getStandings().find((s) => s.teamId === team.id),
    roster: players.filter((p) => p.teamId === team.id),
    games: games.filter((g) => g.homeId === team.id || g.awayId === team.id),
  });
});

api.get('/games', (req, res) => {
  const { matchday, status, team } = req.query;
  let result = games;
  if (matchday) result = result.filter((g) => g.matchday === Number(matchday));
  if (status) result = result.filter((g) => g.status === status);
  if (team) result = result.filter((g) => g.homeId === team || g.awayId === team);
  res.json(result);
});

api.get('/games/:id', (req, res) => {
  const game = games.find((g) => g.id === req.params.id);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  res.json(game);
});

api.get('/standings', (req, res) => res.json(getStandings()));

api.get('/players', (req, res) => {
  const { team, sort = 'goals', limit } = req.query;
  let result = team ? players.filter((p) => p.teamId === team) : [...players];
  if (['goals', 'assists', 'apps', 'cleanSheets'].includes(sort)) {
    result.sort((a, b) => b.stats[sort] - a.stats[sort] || a.name.localeCompare(b.name));
  }
  if (limit) result = result.slice(0, Number(limit));
  res.json(result);
});

api.get('/news', (req, res) => res.json(news.map(({ body, ...rest }) => rest)));

api.get('/news/:id', (req, res) => {
  const article = news.find((n) => n.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

app.use('/api', api);

// In production, serve the built React app from the same server.
const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
