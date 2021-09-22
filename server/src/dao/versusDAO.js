const allVenues = `
SELECT * FROM ${process.env.DATABASE}.venues`;

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
  static async getAllVenues() {
    try {
      client = await poolRef.connect();
      const venues = await client.query(allVenues);
      return venues.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
}
