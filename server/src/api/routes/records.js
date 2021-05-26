import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

/* group by priority? */

const selectRecordsAndPlayers = `
SELECT
records.record_ID,
record_types.label,
record_types.description,
records.player_ID,
players.name,
records.value,
records.current,
records.created,
records.modified
FROM ${process.env.DATABASE}.records
LEFT JOIN record_types ON records.record_type_ID=record_types.record_type_ID
LEFT JOIN players ON records.player_ID = players.player_ID
`;
const whereCurrentRecord = `WHERE records.current = 1`;
const wherePlayerId = `WHERE records.player_ID = ?`;
const whereRecordTypeId = `WHERE records.record_type_ID = ?`;
const orderByDesc = `ORDER BY records.record_ID DESC`;

router.get('/', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(
      `${selectRecordsAndPlayers} ${whereCurrentRecord} ${orderByDesc}`
    );
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

router.get('/all', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(`${selectRecordsAndPlayers} ${orderByDesc}`);
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

router.get('/player/:id', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(
      `${selectRecordsAndPlayers} ${wherePlayerId}`,
      req.params.id
    );
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

router.get('/type/:id', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(
      `${selectRecordsAndPlayers} ${whereRecordTypeId} ${orderByDesc}`,
      req.params.id
    );
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

export { router as records };
