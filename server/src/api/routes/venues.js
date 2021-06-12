import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const allVenues = `
SELECT * FROM ${process.env.DATABASE}.venues`;

router.get('/', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(allVenues);
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

export { router as venues };
