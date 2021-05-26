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
SELECT tournaments.tournament_ID,
tournaments.title,
tournaments.date,
tournaments.venue_ID,
venues.title as venue_title,
venues.indoor,
venues.est,
venues.pitchSize,
venues.location,
tournaments.games,
tournaments.first_ID,
p1.name as first_name,
tournaments.second_ID,
p2.name as second_name,
tournaments.third_ID,
p3.name as third_name
FROM ${process.env.DATABASE}.tournaments
LEFT JOIN venues ON tournaments.venue_ID = venues.venue_ID
LEFT JOIN players AS p1 ON first_ID = p1.player_ID
LEFT JOIN players AS p2 ON second_ID = p2.player_ID
LEFT JOIN players AS p3 ON third_ID = p3.player_ID
`;

const orderByDate = `ORDER BY tournaments.date DESC`;
const limitByRecent = `LIMIT ${process.env.RECENT_ITEMS}`;
const whereId = `WHERE tournaments.tournament_ID = ?`;

router.get('/', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(`${selectTournaments} ${orderByDate}`);
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(
      `${selectTournaments} ${whereId}`,
      req.params.id
    );
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

router.get('/recent/', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(
      `${selectTournaments} ${limitByRecent} ${orderByDate}`
    );
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

export { router as tournaments };
