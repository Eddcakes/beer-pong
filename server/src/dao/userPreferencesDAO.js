const selectUserPreferences = `
SELECT avatar_link as "avatarLink", modified, user_id FROM ${process.env.DATABASE}.preferences WHERE user_id = $1`;

const insertUserPreferences = `
INSERT INTO ${process.env.DATABASE}.preferences (user_id, avatar_link) VALUES($1, $2)`;

let client;
let poolRef;
export default class UserPreferencesDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(
        `Unable to connect to connection pool in UserPreferencesDAO: ${err}`
      );
    } finally {
      client.release();
    }
  }
  static async getUserPreferences(userId) {
    try {
      const preferences = await poolRef.query(selectUserPreferences, [userId]);
      return preferences.rows;
    } catch (err) {
      console.error(err.message);
    }
  }
  static async postUserPreferences(userId, prefs) {
    try {
      // query is different depending if user profile exists
      const userPreferences = await poolRef.query(`${selectUserPreferences}`, [
        userId,
      ]);
      if (userPreferences.rowCount > 0) {
        const update = `UPDATE ${process.env.DATABASE}.preferences
        SET avatar_link=$1
        WHERE user_id=$2`;
        const updateUserPreferences = await poolRef.query(update, [
          prefs,
          userId,
        ]);
        //res.json({ message: 'Preferences updated' });
        return updateUserPreferences.rows;
      } else {
        const values = [userId, prefs];
        const createUserPreferences = await poolRef.query(
          insertUserPreferences,
          values
        );
        //res.json({ message: 'Preferences created' });
        return createUserPreferences.rows;
      }
    } catch (err) {
      console.error(err.message);
    }
  }
}
