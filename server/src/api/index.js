import express from 'express';
//const express = require('express');
import { message } from './placeholder.js';
import { games } from './routes/games.js';
import { players } from './routes/players.js';
import { tournaments } from './routes/tournaments.js';
import { venues } from './routes/venues.js';
import { versusResults } from './routes/versusResults.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: message });
});

router.use('/games', games);
router.use('/players', players);
router.use('/tournaments', tournaments);
router.use('/venues', venues);
router.use('/versus', versusResults);

export { router as api };
