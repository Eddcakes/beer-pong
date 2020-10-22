import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const allPlayers = `
SELECT * FROM ${process.env.DATABASE}.players`;

//getting nicks a bit weird?
const playerDetails = `
SELECT 
players.player_ID,
players.name
FROM players`;

const wherePlayerId = `WHERE players.player_ID = ?`;

router.get('/', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(allPlayers);
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
      `${playerDetails} ${wherePlayerId}`,
      req.params.id
    );
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

export { router as players };
