import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getGames = jest.fn(() => mockGames);
const getGameById = jest.fn((byId) =>
  mockGames.find((game) => game.id === byId)
);
const getTournamentGamesById = jest.fn((tournamentId) =>
  mockGames.filter((game) => game.tournament_id === tournamentId)
);
const getRecentGamesByPlayerId = jest.fn((playerId) => {
  return mockGames.filter((game) => {
    return game.home_id === playerId || game.away_id === playerId;
  });
});
const postNewGame = jest.fn();
const patchGame = jest.fn();

const app = makeApp({
  getGames,
  getGameById,
  getTournamentGamesById,
  getRecentGamesByPlayerId,
  postNewGame,
  patchGame,
});

const apiRoute = '/api/v1';

describe('games routes mock tests', () => {
  test('calls get games from db', async () => {
    await supertest(app).get(`${apiRoute}/games`);
    expect(getGames.mock.calls.length).toBe(1);
    expect(getGames.mock.results[0].value.length).toBe(3);
  });
  test('get game by id', async () => {
    await supertest(app).get(`${apiRoute}/games/${mockGames[0].id}`);
    expect(getGameById.mock.calls.length).toBe(1);
    expect(getGameById.mock.results[0].value).toBe(mockGames[0]);
  });
  test('get games by tournament id', async () => {
    await supertest(app).get(
      `${apiRoute}/games/tournament/${mockGames[2].tournament_id}`
    );
    expect(getTournamentGamesById.mock.calls.length).toBe(1);
    expect(getTournamentGamesById.mock.results[0].value.length).toBe(2);
  });
  test('get recent games by player id', async () => {
    await supertest(app).get(`${apiRoute}/games/recent/1`);
    expect(getRecentGamesByPlayerId.mock.calls.length).toBe(1);
    expect(getRecentGamesByPlayerId.mock.results[0].value.length).toBe(2);
  });
  test.todo('create a new game');
  /*   test('create a new game', async () => {
      const newGame = {
        awayCupsLeft: 2,
        awayForfeit: false,
        gameSize: 6,
        homeCupsLeft: 0,
        homeForfeit: false,
        locked: true,
        player1: 1,
        player2: 3,
        table: null,
        venue: 5,
        created: new Date(),
      };
    await supertest(app)
      .post(`${apiRoute}/games/new`)
      .set('Content-type', 'application/json')
      .send(newGame);
    expect(postNewGame.mock.calls.length).toBe(1);
  }); */

  test.todo('modify an existing game');
});

const mockGames = [
  {
    id: '3',
    venue_id: '1',
    venue: 'Kingfisher Park',
    event: 'Mock a different event',
    date: '2016-06-30T23:00:00.000Z',
    home_id: '5',
    home_name: 'Marc',
    home_cups_left: 1,
    away_id: '1',
    away_name: 'MG',
    away_cups_left: 0,
    tournament_id: '2',
    stage: 'group1',
    notes: null,
    forfeit: false,
    created: '2021-04-12T20:26:56.000Z',
    modified: '2021-04-12T20:26:56.000Z',
    created_by: '1',
    modified_by: '1',
    game_table: null,
    locked: true,
  },
  {
    id: '2',
    venue_id: '1',
    venue: 'Kingfisher Park',
    event: 'Summer Beer Pong tournament 2016',
    date: '2016-06-30T23:00:00.000Z',
    home_id: '3',
    home_name: 'Edd',
    home_cups_left: 3,
    away_id: '4',
    away_name: 'MD',
    away_cups_left: 0,
    tournament_id: '1',
    stage: 'group1',
    notes: null,
    forfeit: false,
    created: '2021-04-12T20:26:56.000Z',
    modified: '2021-04-12T20:26:56.000Z',
    created_by: '1',
    modified_by: '1',
    game_table: null,
    locked: true,
  },
  {
    id: '1',
    venue_id: '1',
    venue: 'Kingfisher Park',
    event: 'Summer Beer Pong tournament 2016',
    date: '2016-06-30T23:00:00.000Z',
    home_id: '1',
    home_name: 'MG',
    home_cups_left: 3,
    away_id: '2',
    away_name: 'Ryan',
    away_cups_left: 0,
    tournament_id: '1',
    stage: 'group1',
    notes: null,
    forfeit: false,
    created: '2021-04-12T20:26:56.000Z',
    modified: '2021-04-12T20:26:56.000Z',
    created_by: '1',
    modified_by: '1',
    game_table: null,
    locked: true,
  },
];
