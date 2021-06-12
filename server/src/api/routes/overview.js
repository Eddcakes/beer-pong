import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const collate = `
SELECT 
  (SELECT players.name FROM players WHERE players.id = $1) AS "name",
  COUNT(games.id) AS "games",
  SUM(IF(forfeit = true AND home_id = $2 AND home_cups_left = 0, 1, IF(forfeit=true AND away_id= $3 AND away_cups_left = 0, 1, 0))) AS "forfeits",
	SUM(IF(home_id = $4 AND home_cups_left != 0,1,0)) AS "homeWins",
	SUM(IF(away_id = $5 AND away_cups_left != 0,1,0)) AS "awayWins",
	SUM(stage LIKE 'group%') AS "groupGames",
	SUM(stage LIKE 'quarter%') AS "quarterFinals",
	SUM(stage LIKE 'semi%') AS "semiFinals",
	SUM(stage='final') AS "finals",
	SUM(
		IF(stage='final' AND home_id = $6 AND home_cups_left != 0,1,0) OR
		IF(stage='final' AND away_id = $7 AND away_cups_left != 0,1,0)
		) AS "finalsWon"	
		FROM ${process.env.DATABASE}.games WHERE home_id = $8 OR away_id = $9`;

// should i return the ID i searched for aswell? or even join on player name
router.get('/:id', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(`${collate}`, [
      req.params.id,
      req.params.id,
      req.params.id,
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
  } finally {
    client.release();
  }
});

export { router as overview };
