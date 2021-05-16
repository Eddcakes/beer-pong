import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const selectAllGames = `
SELECT * FROM ${process.env.DATABASE}.games`;

const selectAndExpandGames = `
SELECT games.game_ID,
games.venue_ID,
venues.title as venue,
tournaments.title as event,
games.date,
games.home_ID,
p1.name as home_name,
games.homeCupsLeft,
games.away_ID,
p2.name as away_name,
games.awayCupsLeft,
games.tournament_ID,
games.stage,
games.notes,
games.forfeit,
games.created,
games.modified,
games.created_by,
games.modified_by,
games.game_table
FROM ${process.env.DATABASE}.games
INNER JOIN players AS p1 ON home_ID = p1.player_ID
INNER JOIN players AS p2 ON away_ID = p2.player_ID
LEFT JOIN tournaments ON games.tournament_ID = tournaments.tournament_ID
LEFT JOIN venues ON games.venue_ID = venues.venue_ID`;
const whereGameId = `WHERE games.game_ID = ?`;
const orderByIdDesc = `ORDER BY games.game_ID DESC`;

router.get('/', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(`${selectAndExpandGames} ${orderByIdDesc}`);
    const transformed = data.map((game) => {
      if (game.game_table !== null && game.game_table.length > 0) {
        game.game_table = JSON.parse(game.game_table);
      }
      return game;
    });
    return res.json(transformed);
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
      `${selectAndExpandGames} ${whereGameId}`,
      req.params.id
    );
    const transformed = data.map((game) => {
      if (game.game_table !== null && game.game_table.length > 0) {
        game.game_table = JSON.parse(game.game_table);
      }
      return game;
    });
    return res.json(transformed);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

export { router as games };
