const allVenues = `
SELECT * FROM ${process.env.DATABASE}.venues`;

let client;
let poolRef;
export default class VenuesDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(
        `Unable to connect to connection pool in VenuesDAO: ${err}`
      );
    } finally {
      client.release();
    }
  }
  static async getAllVenues() {
    try {
      const venues = await poolRef.query(allVenues);
      return venues.rows;
    } catch (err) {
      console.error(err.message);
    }
  }
}
