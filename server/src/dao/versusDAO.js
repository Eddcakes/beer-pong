const query = `SELECT
games.id, games.venue_id, games.date, games.home_id, games.home_cups_left, games.away_id, games.away_cups_left, games.tournament_id, games.stage, games.notes,
p1.name as home_name, p2.name as away_name, tournaments.title as event, venues.title as venue
FROM ${process.env.DATABASE}.games
LEFT JOIN ${process.env.DATABASE}.players AS p1 ON home_id = p1.id
LEFT JOIN ${process.env.DATABASE}.players AS p2 ON away_id = p2.id
LEFT JOIN ${process.env.DATABASE}.tournaments ON games.tournament_id = tournaments.id
LEFT JOIN ${process.env.DATABASE}.venues ON games.venue_id = venues.id`;
const pvp = `WHERE games.archived = false AND (home_id = $1 AND away_id = $2 OR away_id = $3 AND home_id = $4)`;

let client;
let poolRef;
export default class VersusDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(
        `Unable to connect to connection pool in VersusDAO: ${err}`
      );
    } finally {
      client.release();
    }
  }
  static async getVersusResults(player1Id, player2Id) {
    try {
      const data = await poolRef.query(`${query} ${pvp}`, [
        player1Id,
        player2Id,
        player1Id,
        player2Id,
      ]);
      return data.rows;
    } catch (err) {
      console.error(err.message);
    }
  }
}
