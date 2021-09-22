const collate = `
SELECT 
  (SELECT players.name FROM ${process.env.DATABASE}.players WHERE players.id = $1) AS "name",
  COUNT(games.id) AS "games",
  SUM(
    CASE 
    WHEN (forfeit = true AND home_id = $2 AND home_cups_left = 0) THEN 1
    WHEN (forfeit=true AND away_id= $3 AND away_cups_left = 0) THEN 1 
    ELSE 0 
    END
  ) AS "forfeits",
  SUM (CASE WHEN (home_id = $4 AND home_cups_left != 0) THEN 1 ELSE 0 END) AS "homeWins",
  SUM (CASE WHEN (away_id = $5 AND away_cups_left != 0) THEN 1 ELSE 0 END) AS "awayWins",
	SUM( CASE WHEN stage LIKE 'group%' THEN 1 ELSE 0 END) AS "groupGames",
	SUM( CASE WHEN stage LIKE 'quarter%' THEN 1 ELSE 0 END) AS "quarterFinals",
	SUM( CASE WHEN stage LIKE 'semi%' THEN 1 ELSE 0 END) AS "semiFinals",
	SUM( CASE WHEN stage='final' THEN 1 ELSE 0 END) AS "finals",
	SUM(
		CASE 
		WHEN (stage='final' AND home_id = $6 AND home_cups_left != 0) THEN 1
		WHEN (stage='final' AND away_id = $7 AND away_cups_left != 0) THEN 1
		ELSE 0
		END
  ) AS "finalsWon"
		FROM ${process.env.DATABASE}.games WHERE home_id = $8 OR away_id = $9`;

let client;
let poolRef;
export default class OverviewDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(
        `Unable to connect to connection pool in OverviewDAO: ${err}`
      );
    } finally {
      client.release();
    }
  }
  static async getOverviewByPlayerId(playerId) {
    try {
      client = await poolRef.connect();
      const playerOverview = await client.query(`${collate}`, [
        playerId,
        playerId,
        playerId,
        playerId,
        playerId,
        playerId,
        playerId,
        playerId,
        playerId,
      ]);
      return playerOverview.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
}
