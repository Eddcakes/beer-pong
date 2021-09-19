import path from 'path';

import makeApp from './app.js';
import GamesDAO from './dao/gamesDAO.js';
import { poolPromise } from './db.js';

const __dirname = path.resolve();

const port = process.env.PORT || 1337;

await GamesDAO.injectDB(poolPromise);
const app = makeApp({
  getGames: GamesDAO.getGames,
  getGameById: GamesDAO.getGameById,
  getTournamentGamesById: GamesDAO.getTournamentGamesById,
  getRecentGamesByPlayerId: GamesDAO.getRecentGamesByPlayerId,
});

// in production use the build file, in dev run server & front end individually
// space in package.json as:production means we have to trim
if (process.env.NODE_ENV.toLowerCase().trim() === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`listening at ${process.env.DB_HOST}:${port}`);
});
