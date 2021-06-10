import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const query = `SELECT
games.game_ID, games.venue_ID, games.date, games.home_ID, games.homeCupsLeft, games.away_ID, games.awayCupsLeft, games.tournament_ID, games.stage, games.notes,
p1.name as home_name, p2.name as away_name, tournaments.title as event, venues.title as venue
FROM ${process.env.DATABASE}.games
LEFT JOIN players AS p1 ON home_ID = p1.player_ID
LEFT JOIN players AS p2 ON away_ID = p2.player_ID
LEFT JOIN tournaments ON games.tournament_ID = tournaments.tournament_ID
LEFT JOIN venues ON games.venue_ID = venues.venue_ID`;
const pvp = `WHERE games.archived = 0 AND (home_ID = ? AND away_ID = ? OR away_ID = ? AND home_ID = ?)`;

router.get('/', async (req, res) => {
  return res.json({ message: 'Versus requires 2 IDs to compare' });
});

router.get('/:p1Id/:p2Id', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(`${query} ${pvp}`, [
      req.params.p1Id,
      req.params.p2Id,
      req.params.p1Id,
      req.params.p2Id,
    ]);
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

export { router as versusResults };
