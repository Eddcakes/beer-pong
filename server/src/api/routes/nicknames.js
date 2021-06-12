import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const selectNicks = `
SELECT
*
FROM ${process.env.DATABASE}.nicknames
`;
const wherePlayerId = `WHERE nicknames.player_id = $1`;

router.get('/', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(selectNicks);
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
    const data = await client.query(`${selectNicks} ${wherePlayerId}`, [
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

export { router as nicknames };
