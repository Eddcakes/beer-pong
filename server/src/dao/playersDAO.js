const allPlayers = `
SELECT * FROM ${process.env.DATABASE}.players`;

//getting nicks a bit weird?
const playerDetails = `
SELECT 
players.id,
players.name
FROM ${process.env.DATABASE}.players`;

const wherePlayerId = `WHERE players.id = $1`;

let client;
let poolRef;
export default class PlayersDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(
        `Unable to connect to connection pool in PlayersDAO: ${err}`
      );
    } finally {
      client.release();
    }
  }
  static async getPlayers() {
    try {
      client = await poolRef.connect();
      const players = await client.query(allPlayers);
      return players.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
  static async getPlayerById(playerId) {
    try {
      client = await poolRef.connect();
      const player = await client.query(`${playerDetails} ${wherePlayerId}`, [
        playerId,
      ]);
      return player.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
  static async postNewPlayer(playerName) {
    try {
      client = await poolRef.connect();
      const values = [playerName];
      const checkPlayers = await client.query(selectPlayerByName, [playerName]);
      if (checkPlayers.rowCount > 0) {
        //user already exists with this username
        const playerAlreadyExists = new Error(
          'Sorry player name already is taken. Please choose another one.'
        );
        return playerAlreadyExists;
      } else {
        const createNewPlayer = client.query(insertNewPlayer, values);
        if (createNewPlayer) {
          return createNewPlayer;
        } else {
          const error = new Error('Could not create player');
          return error;
        }
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
}
