import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const alltournaments = `
SELECT * FROM ${process.env.DATABASE}.tournaments`;

/* tournament state
created
In progress
completej
postponed
*/
const selectTournaments = `
SELECT tournaments.id,
tournaments.title,
tournaments.date,
tournaments.venue_id,
venues.title as venue_title,
venues.indoor,
venues.est,
venues.pitchSize,
venues.location,
tournaments.games,
tournaments.first_id,
p1.name as first_name,
tournaments.second_id,
p2.name as second_name,
tournaments.third_id,
p3.name as third_name
FROM ${process.env.DATABASE}.tournaments
LEFT JOIN venues ON tournaments.venue_id = venues.id
LEFT JOIN players AS p1 ON first_id = p1.id
LEFT JOIN players AS p2 ON second_id = p2.id
LEFT JOIN players AS p3 ON third_id = p3.id
`;

const orderByDate = `ORDER BY tournaments.date DESC`;
const limitByRecent = `LIMIT ${process.env.RECENT_ITEMS}`;
const whereId = `WHERE tournaments.id = $1`;

router.get('/', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(`${selectTournaments} ${orderByDate}`);
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

router.get('/recent/', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(
      `${selectTournaments} ${orderByDate} ${limitByRecent}`
    );
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
    const data = await client.query(`${selectTournaments} ${whereId}`, [
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

export { router as tournaments };
