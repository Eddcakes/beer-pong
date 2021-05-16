import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const selectNicks = `
SELECT
*
FROM ${process.env.DATABASE}.nicknames
`;
const wherePlayerId = `WHERE nicknames.player_ID = ?`;

router.get('/', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(selectNicks);
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
      `${selectNicks} ${wherePlayerId}`,
      req.params.id
    );
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

export { router as nicknames };
