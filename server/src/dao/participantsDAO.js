const participantsByTournamentId = `
SELECT 
participants.id,
participants.tournament_id,
players.id as player_id,
players.name as player_name,
players.active as player_active
FROM ${process.env.DATABASE}.participants
LEFT JOIN ${process.env.DATABASE}.players ON participants.player_id = players.id
WHERE participants.tournament_id = $1`;

const insertNewParticipant = `
INSERT INTO ${process.env.DATABASE}.participants
(player_id, tournament_id)
VALUES($1, $2)
RETURNING id, player_id, tournament_id`;

const bulkInsertStart = `
INSERT INTO ${process.env.DATABASE}.participants
(player_id, tournament_id)`;
const bulkInsertEnd = 'RETURNING id, player_id, tournament_id';

// https://github.com/brianc/node-postgres/issues/957
function expand(rowCount, columnCount, startAt = 1) {
  let index = startAt;
  return Array(rowCount)
    .fill(0)
    .map(
      () =>
        `(${Array(columnCount)
          .fill(0)
          .map(() => `$${index++}`)
          .join(', ')})`
    )
    .join(', ');
}

let client;
let poolRef;
export default class ParticipantsDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(
        `Unable to connect to connection pool in ParticipantsDAO: ${err}`
      );
    } finally {
      client.release();
    }
  }
  static async getParticipantsByTournamentId(tournamentId) {
    try {
      const participants = await poolRef.query(participantsByTournamentId, [
        tournamentId,
      ]);
      return participants.rows;
    } catch (err) {
      console.error(err.message);
    }
  }
  static async postNewParticipant(playerId, tournamentId) {
    try {
      const addNewParticipant = await poolRef.query(insertNewParticipant, [
        playerId,
        tournamentId,
      ]);
      if (addNewParticipant) {
        return addNewParticipant;
      } else {
        const error = new Error('Could not add new participant');
        return error;
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  /**
   *
   * @param {string[]} arrayOfParticipants - array of player ids to add as participants
   * @param {int} tournamentId - id of tournament to bulk add to
   */
  static async postBulkNewParticipant(arrayOfParticipants, tournamentId) {
    try {
      const withTournament = arrayOfParticipants.map((playerId) => [
        playerId,
        tournamentId,
      ]);
      const bulkInsert = await poolRef.query(
        `${bulkInsertStart} ${expand(
          arrayOfParticipants.length,
          2
        )} ${bulkInsertEnd}`,
        withTournament.flat()
      );
      return bulkInsert;
    } catch (err) {
      console.error(err.message);
    }
  }
  // remove participant?
  // should only be able to be done if tournament isn't started?
  static async removeParticipant(playerId, tournamentId) {}
}
