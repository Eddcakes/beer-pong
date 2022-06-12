import path from 'path';

import makeApp from './app.js';
import GamesDAO from './dao/gamesDAO.js';
import NewsDAO from './dao/newsDAO.js';
import OverviewDAO from './dao/overviewDAO.js';
import NicknamesDAO from './dao/nicknamesDAO.js';
import PlayersDAO from './dao/playersDAO.js';
import RecordsDAO from './dao/recordsDAO.js';
import TournamentsDAO from './dao/tournamentsDAO.js';
import UserPreferencesDAO from './dao/userPreferencesDAO.js';
import UsersDAO from './dao/usersDAO.js';
import VenuesDAO from './dao/venuesDAO.js';
import VersusDAO from './dao/versusDAO.js';
import AuthDAO from './api/auth/authDAO.js';
import EmailDAO from './dao/emailDAO.js';
import { poolPromise } from './db.js';

const __dirname = path.resolve();

const port = process.env.PORT || 1337;

await GamesDAO.injectDB(poolPromise);
await NewsDAO.injectDB(poolPromise);
await OverviewDAO.injectDB(poolPromise);
await NicknamesDAO.injectDB(poolPromise);
await PlayersDAO.injectDB(poolPromise);
await RecordsDAO.injectDB(poolPromise);
await TournamentsDAO.injectDB(poolPromise);
await UserPreferencesDAO.injectDB(poolPromise);
await UsersDAO.injectDB(poolPromise);
await VenuesDAO.injectDB(poolPromise);
await VersusDAO.injectDB(poolPromise);
await AuthDAO.injectDB(poolPromise);
await EmailDAO.injectDB(poolPromise);

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
  getUserPreferences: UserPreferencesDAO.getUserPreferences,
  postUserPreferences: UserPreferencesDAO.postUserPreferences,
  getAllUsers: UsersDAO.getAllUsers,
  patchUser: UsersDAO.patchUser,
  getAllVenues: VenuesDAO.getAllVenues,
  getVersusResults: VersusDAO.getVersusResults,
  signin: AuthDAO.signin,
  signup: AuthDAO.signup,
  updatePassword: AuthDAO.updatePassword,
  postEmail: EmailDAO.postEmail,
});

// in production use the build file, in dev run server & front end individually
// space in package.json as:production means we have to trim
if (process.env.NODE_ENV.toLowerCase().trim() === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`listening at ${process.env.DB_HOST}:${port}`);
});
