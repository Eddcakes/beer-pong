import makeApp from './app.js';
import GamesDAO from './dao/gamesDAO.js';
import NewsDAO from './dao/newsDAO.js';
import OverviewDAO from './dao/overviewDAO.js';
import NicknamesDAO from './dao/nicknamesDAO.js';
import PlayersDAO from './dao/playersDAO.js';
import RecordsDAO from './dao/recordsDAO.js';
import TournamentsDAO from './dao/tournamentsDAO.js';
import ParticipantsDAO from './dao/participantsDAO.js';
import UserPreferencesDAO from './dao/userPreferencesDAO.js';
import UsersDAO from './dao/usersDAO.js';
import VenuesDAO from './dao/venuesDAO.js';
import VersusDAO from './dao/versusDAO.js';
import AuthDAO from './api/auth/authDAO.js';
import { poolPromise } from './db.js';

const port = process.env.PORT || 1337;

await GamesDAO.injectDB(poolPromise);
await NewsDAO.injectDB(poolPromise);
await OverviewDAO.injectDB(poolPromise);
await NicknamesDAO.injectDB(poolPromise);
await PlayersDAO.injectDB(poolPromise);
await RecordsDAO.injectDB(poolPromise);
await TournamentsDAO.injectDB(poolPromise);
await ParticipantsDAO.injectDB(poolPromise);
await UserPreferencesDAO.injectDB(poolPromise);
await UsersDAO.injectDB(poolPromise);
await VenuesDAO.injectDB(poolPromise);
await VersusDAO.injectDB(poolPromise);
await AuthDAO.injectDB(poolPromise);

const app = makeApp({
  getGames: GamesDAO.getGames,
  getGameById: GamesDAO.getGameById,
  getTournamentGamesById: GamesDAO.getTournamentGamesById,
  getRecentGamesByPlayerId: GamesDAO.getRecentGamesByPlayerId,
  postNewGame: GamesDAO.postNewGame,
  patchGame: GamesDAO.patchGame,
  getNews: NewsDAO.getNews,
  getNewsById: NewsDAO.getNewsById,
  getOverviewByPlayerId: OverviewDAO.getOverviewByPlayerId,
  getNicknames: NicknamesDAO.getNicknames,
  getNicknameOfPlayerId: NicknamesDAO.getNicknameOfPlayerId,
  getPlayers: PlayersDAO.getPlayers,
  getPlayerById: PlayersDAO.getPlayerById,
  postNewPlayer: PlayersDAO.postNewPlayer,
  getCurrentRecords: RecordsDAO.getCurrentRecords,
  getAllRecords: RecordsDAO.getAllRecords,
  getRecordsByPlayerId: RecordsDAO.getRecordsByPlayerId,
  getRecordsByTypeId: RecordsDAO.getRecordsByTypeId,
  getTournaments: TournamentsDAO.getTournaments,
  getRecentTournaments: TournamentsDAO.getRecentTournaments,
  getTournamentById: TournamentsDAO.getTournamentById,
  postNewTournament: TournamentsDAO.postNewTournament,
  getParticipantsByTournamentId: ParticipantsDAO.getParticipantsByTournamentId,
  getUserPreferences: UserPreferencesDAO.getUserPreferences,
  postUserPreferences: UserPreferencesDAO.postUserPreferences,
  getAllUsers: UsersDAO.getAllUsers,
  patchUser: UsersDAO.patchUser,
  getAllVenues: VenuesDAO.getAllVenues,
  getVersusResults: VersusDAO.getVersusResults,
  signin: AuthDAO.signin,
  signup: AuthDAO.signup,
  updatePassword: AuthDAO.updatePassword,
  forgotPassword: AuthDAO.forgotPassword,
  resetForgotPassword: AuthDAO.resetForgotPassword,
});

app.listen(port, () => {
  console.log(`listening at ${process.env.DB_HOST}:${port}`);
});
