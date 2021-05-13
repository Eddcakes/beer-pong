import express from 'express';
//const express = require('express');
import { auth } from './auth/index.js';
import { message } from './placeholder.js';
import { games } from './routes/games.js';
import { players } from './routes/players.js';
import { tournaments } from './routes/tournaments.js';
import { users } from './routes/users.js';
import { venues } from './routes/venues.js';
import { versusResults } from './routes/versusResults.js';
import { overview } from './routes/overview.js';
import { userPreferences } from './routes/userPreferences.js';
import { postGames } from './routes/games.post.js';
import { isAdmin, isLoggedIn } from './auth/auth.middlewares.js';
import { news } from './routes/news.js';

const router = express.Router();

/* give client user details from session */
router.get('/', (req, res) => {
  res.json({
    message: message,
    user: req.session.user,
  });
});

router.use('/auth', auth);
router.use('/games', games);
router.use('/news', news);
router.use('/overview', overview);
router.use('/players', players);
router.use('/tournaments', tournaments);

router.use('/venues', venues);
router.use('/versus', versusResults);

//protected routes
router.use('/preferences', isLoggedIn, userPreferences);
router.use('/games', isLoggedIn, postGames);
router.use('/users', isLoggedIn, isAdmin, users);

export { router as api };
