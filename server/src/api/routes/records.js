import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

/* group by priority? */

const selectRecordsAndPlayers = `
SELECT
records.id,
record_types.label,
record_types.description,
records.player_id,
players.name,
records.value,
records.current,
records.created,
records.modified
FROM ${process.env.DATABASE}.records
LEFT JOIN ${process.env.DATABASE}.record_types ON records.record_type_id=record_types.id
LEFT JOIN ${process.env.DATABASE}.players ON records.player_id = players.id
`;
const whereCurrentRecord = `WHERE records.current = true`;
const wherePlayerId = `WHERE records.player_id = $1`;
const whereRecordTypeId = `WHERE records.record_type_id = $1`;
const orderByDesc = `ORDER BY records.id DESC`;

router.get('/', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(
      `${selectRecordsAndPlayers} ${whereCurrentRecord} ${orderByDesc}`
    );
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

router.get('/all', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(
      `${selectRecordsAndPlayers} ${orderByDesc}`
    );
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

router.get('/player/:id', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(
      `${selectRecordsAndPlayers} ${wherePlayerId}`,
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

router.get('/type/:id', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(
      `${selectRecordsAndPlayers} ${whereRecordTypeId} ${orderByDesc}`,
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

export { router as records };
