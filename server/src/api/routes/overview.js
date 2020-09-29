import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

// need to fix up forfeit calculation, currently counts both yours and oponents, should only count yours
const collate = `
SELECT COUNT(game_ID) AS 'games',
	SUM(forfeit = 1) AS 'forfeits',
	SUM(if(home_ID = ? AND homeCupsLeft != 0,1,0)) AS 'homeWins',
	SUM(if(away_ID = ? AND awayCupsLeft != 0,1,0)) AS 'awayWins',
	SUM(stage LIKE 'group%') AS 'groupGames',
	SUM(stage LIKE 'quarter%') AS 'quarterFinals',
	SUM(stage LIKE 'semi%') AS 'semiFinals',
	SUM(stage='final') AS 'finals',
	SUM(
		if(stage='final' AND home_ID = ? AND homeCupsLeft != 0,1,0) OR
		if(stage='final' AND away_ID = ? AND awayCupsLeft != 0,1,0)
		) AS 'finalsWon'	
		FROM ${process.env.DATABASE}.games WHERE home_ID = ? OR away_ID = ?`;

// should i return the ID i searched for aswell? or even join on player name
router.get('/:id', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(`${collate}`, [
      req.params.id,
      req.params.id,
      req.params.id,
      req.params.id,
      req.params.id,
      req.params.id,
      req.params.id,
    ]);
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

export { router as overview };
