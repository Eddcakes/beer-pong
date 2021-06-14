import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const selectAndExpandGames = `
SELECT games.id,
games.venue_id,
venues.title as venue,
tournaments.title as event,
games.date,
games.home_id,
p1.name as home_name,
games.home_cups_left,
games.away_id,
p2.name as away_name,
games.away_cups_left,
games.tournament_id,
games.stage,
games.notes,
games.forfeit,
games.created,
games.modified,
games.created_by,
games.modified_by,
games.game_table,
games.locked
FROM ${process.env.DATABASE}.games
INNER JOIN ${process.env.DATABASE}.players AS p1 ON home_id = p1.id
INNER JOIN ${process.env.DATABASE}.players AS p2 ON away_id = p2.id
LEFT JOIN ${process.env.DATABASE}.tournaments ON games.tournament_id = tournaments.id
LEFT JOIN ${process.env.DATABASE}.venues ON games.venue_id = venues.id`;
const whereGameId = `WHERE games.archived = false AND games.id = $1`;
const whereTournamentId = `WHERE games.archived = false AND games.tournament_id = $1`;
const wherePlayerId = `WHERE games.archived = false AND (games.home_id = $1 OR games.away_id = $2)`;
const orderByIdDesc = `ORDER BY games.id DESC`;
const orderByDateDesc = `ORDER BY games.date DESC`;
const limitByRecent = `LIMIT ${process.env.RECENT_ITEMS}`;

router.get('/', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(`${selectAndExpandGames} ${orderByIdDesc}`);
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

router.get('/:id', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(`${selectAndExpandGames} ${whereGameId}`, [
      req.params.id,
    ]);
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

router.get('/tournament/:id', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(
      `${selectAndExpandGames} ${whereTournamentId}`,
      [req.params.id]
    );
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

router.get('/recent/:id', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(
      `${selectAndExpandGames} ${wherePlayerId} ${orderByDateDesc} ${limitByRecent}`,
      [req.params.id, req.params.id]
    );
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

export { router as games };
