import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const query = `SELECT
games.id, games.venue_id, games.date, games.home_id, games.home_cups_left, games.away_id, games.away_cups_left, games.tournament_id, games.stage, games.notes,
p1.name as home_name, p2.name as away_name, tournaments.title as event, venues.title as venue
FROM ${process.env.DATABASE}.games
LEFT JOIN ${process.env.DATABASE}.players AS p1 ON home_id = p1.id
LEFT JOIN ${process.env.DATABASE}.players AS p2 ON away_id = p2.id
LEFT JOIN ${process.env.DATABASE}.tournaments ON games.tournament_id = tournaments.id
LEFT JOIN ${process.env.DATABASE}.venues ON games.venue_id = venues.id`;
const pvp = `WHERE games.archived = false AND (home_id = $1 AND away_id = $2 OR away_id = $3 AND home_id = $4)`;

router.get('/', async (req, res) => {
  return res.json({ message: 'Versus requires 2 IDs to compare' });
});

router.get('/:p1Id/:p2Id', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(`${query} ${pvp}`, [
      req.params.p1Id,
      req.params.p2Id,
      req.params.p1Id,
      req.params.p2Id,
    ]);
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

export { router as versusResults };
