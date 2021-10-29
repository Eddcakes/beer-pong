const selectNicks = `
SELECT
*
FROM ${process.env.DATABASE}.nicknames
`;
const wherePlayerId = `WHERE nicknames.player_id = $1`;

let client;
let poolRef;
export default class NicknamesDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(
        `Unable to connect to connection pool in NicknamesDAO: ${err}`
      );
    } finally {
      client.release();
    }
  }
  static async getNicknames() {
    try {
      client = await poolRef.connect();
      const nicknames = await client.query(selectNicks);
      return nicknames.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
  static async getNicknameOfPlayerId(playerId) {
    try {
      client = await poolRef.connect();
      const nicknames = await client.query(`${selectNicks} ${wherePlayerId}`, [
        playerId,
      ]);
      return nicknames.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
}
