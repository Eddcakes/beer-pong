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
import { isLoggedIn } from '../middlewares.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: message, user: req.user });
});

router.use('/auth', auth);
router.use('/games', games);
router.use('/overview', overview);
router.use('/players', players);
router.use('/tournaments', tournaments);
router.use('/users', users);
router.use('/venues', venues);
router.use('/versus', versusResults);

//protected routes
router.use('/preferences', isLoggedIn, userPreferences);

export { router as api };
