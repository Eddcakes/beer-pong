import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const allPlayers = `
SELECT * FROM ${process.env.DATABASE}.players`;

//getting nicks a bit weird?
const playerDetails = `
SELECT 
players.id,
players.name
FROM players`;

const wherePlayerId = `WHERE players.id = $1`;

router.get('/', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(allPlayers);
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
    const data = await client.query(`${playerDetails} ${wherePlayerId}`, [
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

export { router as players };
