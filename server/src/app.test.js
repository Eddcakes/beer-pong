import supertest from 'supertest';
import makeApp from './app.js';
import { jest } from '@jest/globals';

const homeMessage = '🍺 bp app in development, route under construction';

const apiRoute = '/api/v1';

/* mock db calls */
const getGames = jest.fn(() => mockGames);
const getGameById = jest.fn();
const getTournamentGamesById = jest.fn();
const getRecentGamesByPlayerId = jest.fn();

const app = makeApp({
  getGames,
  getGameById,
  getTournamentGamesById,
  getRecentGamesByPlayerId,
});

it('connects to api and returns expected message', async () => {
  try {
    const home = await supertest(app).get(apiRoute);
    expect(home.statusCode).toBe(200);
    expect(home.body.message).toBe(homeMessage);
  } catch (e) {
    expect(e).toBeNull();
  }
});

it('expect 404 error for non-existing page', async () => {
  try {
    const nonsense = await supertest(app).get(`${apiRoute}/gsdgfdsgi`);
    expect(nonsense.statusCode).toBe(404);
    // Path not found
    expect(nonsense.body.message).toContain('Path not found');
  } catch (e) {
    expect(e).toBeNull();
  }
});

/* move these out of app.test */
describe('games routes mock tests', () => {
  test('calls get games from db', async () => {
    await supertest(app).get(`${apiRoute}/games`);
    expect(getGames.mock.calls.length).toBe(1);
    expect(getGames.mock.results[0].value.length).toBe(2);
  });
  test.todo('get game by id');
  test.todo('get games by tournament id');
  test.todo('get recent games by player id');
});

const mockGames = [
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
