const allUsers = `
SELECT id, username, player_id, active, role FROM ${process.env.DATABASE}.users`;

const getUser = `SELECT id, username, player_id, active, role FROM ${process.env.DATABASE}.users WHERE id = $1`;

let client;
let poolRef;
export default class UsersDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(`Unable to connect to connection pool in UsersDAO: ${err}`);
    } finally {
      client.release();
    }
  }
  static async getAllUsers() {
    try {
      client = await poolRef.connect();
      const users = await poolRef.query(allUsers);
      return users.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
  static async patchUser(userId, userDetails) {
    try {
      const dataArray = Object.keys(userDetails).map((col) => {
        return `${col} = '${userDetails[col]}'`;
      });
      const sqlParam = dataArray.join(', ');
      const rebuildQuery = `UPDATE ${process.env.DATABASE}.users SET ${sqlParam} WHERE id = $1`;
      // userDetails
      const userExists = await poolRef.query(getUser, [userId]);
      if (userExists.rowCount > 0) {
        const updateUser = await poolRef.query(rebuildQuery, [userId]);
        return updateUser.rows;
      } else {
        const cannotFindUser = new Error('Cannot find user');
        return cannotFindUser;
      }
    } catch (err) {
      console.error(err.message);
    }
  }
}
