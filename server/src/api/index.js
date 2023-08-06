import express from 'express';
import { authRouter } from './auth/auth.routes.js';
import { message } from './placeholder.js';
import { gamesRouter, gamesProtectedRoutes } from './routes/games.routes.js';
import {
  playersRouter,
  playersProtectedRoutes,
} from './routes/players.routes.js';
import {
  tournamentsProtectedRoutes,
  tournamentsRouter,
} from './routes/tournaments.routes.js';
import { usersRouter } from './routes/users.routes.js';
import { venuesRouter } from './routes/venues.routes.js';
import { versusRouter } from './routes/versus.routes.js';
import { overviewRouter } from './routes/overview.routes.js';
import { userPreferencesRouter } from './routes/userPreferences.routes.js';
import { isAdmin, isLoggedIn, isRole } from './auth/auth.middlewares.js';
import { newsRouter } from './routes/news.routes.js';
import { recordsRouter } from './routes/records.routes.js';
import { nicknamesRouter } from './routes/nicknames.routes.js';

export const apiWithDb = (db) => {
  const router = express.Router();
  /* give client user details from session */
  router.get('/', (req, res) => {
    res.json({
      message: message,
      user: req?.session?.user,
    });
  });
  router.use('/auth', authRouter(db));
  router.use('/games', gamesRouter(db));
  router.use('/news', newsRouter(db));
  router.use('/overview', overviewRouter(db));
  router.use('/players', playersRouter(db));
  router.use('/tournaments', tournamentsRouter(db));
  router.use('/records', recordsRouter(db));
  router.use('/nicknames', nicknamesRouter(db));

  router.use('/venues', venuesRouter(db));
  router.use('/versus', versusRouter(db));

  //protected routes
  router.use('/preferences', isLoggedIn, userPreferencesRouter(db));
  router.use('/games', isLoggedIn, gamesProtectedRoutes(db));
  router.use('/tournaments', isRole(3), tournamentsProtectedRoutes(db));
  router.use('/players', isLoggedIn, isRole(3), playersProtectedRoutes(db));
  router.use('/users', isLoggedIn, isAdmin, usersRouter(db));
  return router;
};
