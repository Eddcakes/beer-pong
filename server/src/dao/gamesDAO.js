const selectAndExpandGames = `
SELECT games.id,
games.venue_id,
venues.title as venue,
tournaments.title as event,
games.date,
games.home_id,
p1.name as home_name,
games.home_cups_left,
games.away_id,
p2.name as away_name,
games.away_cups_left,
games.tournament_id,
games.stage,
games.notes,
games.forfeit,
games.created,
games.modified,
games.created_by,
games.modified_by,
games.game_table,
games.locked
FROM ${process.env.DATABASE}.games
INNER JOIN ${process.env.DATABASE}.players AS p1 ON home_id = p1.id
INNER JOIN ${process.env.DATABASE}.players AS p2 ON away_id = p2.id
LEFT JOIN ${process.env.DATABASE}.tournaments ON games.tournament_id = tournaments.id
LEFT JOIN ${process.env.DATABASE}.venues ON games.venue_id = venues.id`;
const whereGameId = `WHERE games.archived = false AND games.id = $1`;
const whereTournamentId = `WHERE games.archived = false AND games.tournament_id = $1`;
const wherePlayerId = `WHERE games.archived = false AND (games.home_id = $1 OR games.away_id = $2)`;
const orderByIdDesc = `ORDER BY games.id DESC`;
const orderByDateDesc = `ORDER BY games.date DESC`;
const limitByRecent = `LIMIT ${process.env.RECENT_ITEMS}`;

const insertNewGame = `
INSERT INTO ${process.env.DATABASE}.games 
(home_id,
  away_id,
  home_cups_left,
  away_cups_left,
  venue_id,
  forfeit,
  created_by,
  modified_by,
  game_table,
  locked)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING id, home_id, away_id`;

let client;
let poolRef;
export default class GamesDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      // reference pool as pool promise
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(`Unable to connect to connection pool in GamesDAO: ${err}`);
    } finally {
      client.release();
    }
  }
  static async getGames() {
    try {
      const games = await poolRef.query(
        `${selectAndExpandGames} ${orderByIdDesc}`
      );
      return games.rows;
    } catch (err) {
      console.error(err.message);
      return [];
    }
  }
  static async getGameById(gameId) {
    try {
      const gameById = await poolRef.query(
        `${selectAndExpandGames} ${whereGameId}`,
        [gameId]
      );
      return gameById.rows;
    } catch (err) {
      console.error(err.message);
    }
  }

  static async getTournamentGamesById(gameId) {
    try {
      const data = await poolRef.query(
        `${selectAndExpandGames} ${whereTournamentId}`,
        [gameId]
      );
      return data.rows;
    } catch (err) {
      console.error(err.message);
    }
  }
  static async getRecentGamesByPlayerId(playerId) {
    try {
      const data = await poolRef.query(
        `${selectAndExpandGames} ${wherePlayerId} ${orderByDateDesc} ${limitByRecent}`,
        [playerId, playerId]
      );
      return data.rows;
    } catch (err) {
      console.error(err.message);
    }
  }
  static async postNewGame(details) {
    try {
      const createNewGame = await poolRef.query(insertNewGame, details);
      return createNewGame;
    } catch (err) {
      console.error(err.message);
    }
  }
  static async patchGame(homeCupsLeft, awayCupsLeft, table, gameId) {
    try {
      const lockOnWin =
        homeCupsLeft === 0 || awayCupsLeft === 0 ? 'locked=true,' : '';
      const updateSql = `UPDATE ${process.env.DATABASE}.games 
        SET ${lockOnWin}
        home_cups_left=$1,
        away_cups_left=$2,
        game_table=$3
        WHERE ${process.env.DATABASE}.games.id=$4
        `;
      const updateGame = await poolRef.query(updateSql, [
        homeCupsLeft,
        awayCupsLeft,
        table,
        gameId,
      ]);
      return updateGame;
    } catch (err) {
      console.error(err.message);
    }
  }
}
