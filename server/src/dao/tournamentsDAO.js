const selectTournaments = `
SELECT tournaments.id,
tournaments.title,
tournaments.date,
tournaments.venue_id,
venues.title as venue_title,
venues.indoor,
venues.est,
venues.pitchSize,
venues.location,
tournaments.games,
tournaments.first_id,
p1.name as first_name,
tournaments.second_id,
p2.name as second_name,
tournaments.third_id,
p3.name as third_name
FROM ${process.env.DATABASE}.tournaments
LEFT JOIN ${process.env.DATABASE}.venues ON tournaments.venue_id = venues.id
LEFT JOIN ${process.env.DATABASE}.players AS p1 ON first_id = p1.id
LEFT JOIN ${process.env.DATABASE}.players AS p2 ON second_id = p2.id
LEFT JOIN ${process.env.DATABASE}.players AS p3 ON third_id = p3.id
`;

const orderByDate = `ORDER BY tournaments.date DESC`;
const limitByRecent = `LIMIT ${process.env.RECENT_ITEMS}`;
const whereId = `WHERE tournaments.id = $1`;

const insertNewTournament = `
INSERT INTO ${process.env.DATABASE}.tournaments
(title, date, venue_id)
VALUES($1, $2, $3)
RETURNING id, title, date, venue_id`;

// duplicated from participantsDAO
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

let client;
let poolRef;
export default class TournamentsDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(
        `Unable to connect to connection pool in TournamentsDAO: ${err}`
      );
    } finally {
      client.release();
    }
  }
  static async getTournaments() {
    try {
      const tournaments = await poolRef.query(
        `${selectTournaments} ${orderByDate}`
      );
      return tournaments.rows;
    } catch (err) {
      console.error(err.message);
    }
  }
  static async getRecentTournaments() {
    try {
      const tournaments = await poolRef.query(
        `${selectTournaments} ${orderByDate} ${limitByRecent}`
      );
      return tournaments.rows;
    } catch (err) {
      console.error(err.message);
    }
  }
  static async getTournamentById(tournamentId) {
    try {
      const tournaments = await poolRef.query(
        `${selectTournaments} ${whereId}`,
        [tournamentId]
      );
      const participants = await poolRef.query(participantsByTournamentId, [
        tournamentId,
      ]);
      const withParticipants = tournaments.rows;
      withParticipants[0].participants = participants.rows;
      return withParticipants;
    } catch (err) {
      console.error(err.message);
    }
  }
  static async postNewTournament(details) {
    try {
      const createNewTournament = await poolRef.query(
        insertNewTournament,
        details
      );
      return createNewTournament;
    } catch (err) {
      console.error(err.message);
    }
  }
}
