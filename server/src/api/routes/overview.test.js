import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getOverviewByPlayerId = jest.fn(() => mockOverview);

const app = makeApp({
  getOverviewByPlayerId,
});

const apiRoute = '/api/v1/overview';

describe('overviews routes mock tests', () => {
  test('Going to player overviews without a player id should give the requester a message', async () => {
    const request = await supertest(app).get(`${apiRoute}`);
    // isn't calling a database function so nothing to count
    expect(request.body.message).toBe('Player overview requires a player id');
  });
  test('Get overview by player ID', async () => {
    await supertest(app).get(`${apiRoute}/3`);
    expect(getOverviewByPlayerId.mock.calls.length).toBe(1);
    expect(getOverviewByPlayerId.mock.results[0].value.length).toBe(1);
    expect(getOverviewByPlayerId.mock.results[0].value).toStrictEqual(
      mockOverview
    );
  });
});

const mockOverview = [
  {
    name: 'Edd',
    games: '26',
    forfeits: '1',
    homeWins: '7',
    awayWins: '7',
    groupGames: '15',
    quarterFinals: '3',
    semiFinals: '3',
    finals: '0',
    finalsWon: '0',
  },
];
