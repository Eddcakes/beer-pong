/* group by priority? */

const selectRecordsAndPlayers = `
SELECT
records.id,
record_types.label,
record_types.id as record_type_id,
record_types.description,
records.player_id,
players.name,
records.value,
records.current,
records.created,
records.modified
FROM ${process.env.DATABASE}.records
LEFT JOIN ${process.env.DATABASE}.record_types ON records.record_type_id=record_types.id
LEFT JOIN ${process.env.DATABASE}.players ON records.player_id = players.id
`;
const whereCurrentRecord = `WHERE records.current = true`;
const wherePlayerId = `WHERE records.player_id = $1`;
const whereRecordTypeId = `WHERE records.record_type_id = $1`;
const orderByDesc = `ORDER BY records.id DESC`;

let client;
let poolRef;
export default class RecordsDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(
        `Unable to connect to connection pool in RecordsDAO: ${err}`
      );
    } finally {
      client.release();
    }
  }
  static async getCurrentRecords() {
    try {
      client = await poolRef.connect();
      const records = await client.query(
        `${selectRecordsAndPlayers} ${whereCurrentRecord} ${orderByDesc}`
      );
      return records.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
  static async getAllRecords() {
    try {
      client = await poolRef.connect();
      const allRecords = await client.query(
        `${selectRecordsAndPlayers} ${orderByDesc}`
      );
      return allRecords.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
  static async getRecordsByPlayerId(playerId) {
    try {
      client = await poolRef.connect();
      const records = await client.query(
        `${selectRecordsAndPlayers} ${wherePlayerId}`,
        [playerId]
      );
      return records.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
  static async getRecordsByTypeId(typeId) {
    try {
      client = await poolRef.connect();
      const recordsByType = await client.query(
        `${selectRecordsAndPlayers} ${whereRecordTypeId} ${orderByDesc}`,
        [typeId]
      );
      return recordsByType.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
}
