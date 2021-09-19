import express from 'express';
import { auth } from './auth/index.js';
import { message } from './placeholder.js';
import { gamesRouter } from './routes/games.routes.js';
import { players } from './routes/players.js';
import { postPlayer } from './routes/players.post.js';
import { tournaments } from './routes/tournaments.js';
import { users } from './routes/users.js';
import { venues } from './routes/venues.js';
import { versusResults } from './routes/versusResults.js';
import { overview } from './routes/overview.js';
import { userPreferences } from './routes/userPreferences.js';
import { postGames } from './routes/games.post.js';
import { isAdmin, isLoggedIn } from './auth/auth.middlewares.js';
import { news } from './routes/news.js';
import { records } from './routes/records.js';
import { nicknames } from './routes/nicknames.js';

export const apiWithDb = (db) => {
  const router = express.Router();
  /* give client user details from session */
  router.get('/', (req, res) => {
    res.json({
      message: message,
      user: req.session.user,
    });
  });
  router.use('/auth', auth);
  router.use('/games', gamesRouter(db));
  router.use('/news', news);
  router.use('/overview', overview);
  router.use('/players', players);
  router.use('/tournaments', tournaments);
  router.use('/records', records);
  router.use('/nicknames', nicknames);

  router.use('/venues', venues);
  router.use('/versus', versusResults);

  //protected routes
  router.use('/preferences', isLoggedIn, userPreferences);
  router.use('/games', isLoggedIn, postGames);
  router.use('/players', isLoggedIn, isAdmin, postPlayer);
  router.use('/users', isLoggedIn, isAdmin, users);
  return router;
};
