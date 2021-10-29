import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

const recentLimit = 2;
/* mock db calls */
const getTournaments = jest.fn(() => mockTournaments);
const getRecentTournaments = jest.fn(() => {
  // assumption tournaments already sorted by query
  return mockTournaments.slice(mockTournaments.length - recentLimit);
});
const getTournamentById = jest.fn((tId) =>
  mockTournaments.filter((tournament) => tournament.id === tId)
);

const app = makeApp({
  getTournaments,
  getRecentTournaments,
  getTournamentById,
});

const apiRoute = '/api/v1/tournaments';

describe('tournaments routes mock tests', () => {
  test('Correctly calls get tournaments and shows mock data', async () => {
    await supertest(app).get(`${apiRoute}`);
    expect(getTournaments.mock.calls.length).toBe(1);
    expect(getTournaments.mock.results[0].value.length).toBe(3);
    expect(getTournaments.mock.results[0].value).toStrictEqual(mockTournaments);
  });
  test('get recent tournaments', async () => {
    await supertest(app).get(`${apiRoute}/recent`);
    expect(getRecentTournaments.mock.calls.length).toBe(1);
    expect(
      getRecentTournaments.mock.results[0].value.length
    ).toBeLessThanOrEqual(recentLimit);
  });
  test('get tournament by ID', async () => {
    await supertest(app).get(`${apiRoute}/2`);
    expect(getTournamentById.mock.calls.length).toBe(1);
    expect(getTournamentById.mock.results[0].value.length).toBe(1);
    expect(getTournamentById.mock.results[0].value).toStrictEqual([
      {
        id: '2',
        title: 'Summer Beer Pong tournament 2017',
        date: '2017-06-30T23:00:00.000Z',
        venue_id: '1',
        venue_title: 'Kingfisher Park',
        indoor: false,
        est: '2016-01-01T00:00:00.000Z',
        pitchsize: null,
        location: null,
        games: null,
        first_id: '10',
        first_name: 'Matty Jacko',
        second_id: '2',
        second_name: 'Ryan',
        third_id: null,
        third_name: null,
      },
    ]);
  });
});

const mockTournaments = [
  {
    id: '3',
    title: 'Summer Beer Pong tournament 2018',
    date: '2018-06-30T23:00:00.000Z',
    venue_id: '1',
    venue_title: 'Kingfisher Park',
    indoor: false,
    est: '2016-01-01T00:00:00.000Z',
    pitchsize: null,
    location: null,
    games: null,
    first_id: '16',
    first_name: 'Sam',
    second_id: '1',
    second_name: 'MG',
    third_id: null,
    third_name: null,
  },
  {
    id: '2',
    title: 'Summer Beer Pong tournament 2017',
    date: '2017-06-30T23:00:00.000Z',
    venue_id: '1',
    venue_title: 'Kingfisher Park',
    indoor: false,
    est: '2016-01-01T00:00:00.000Z',
    pitchsize: null,
    location: null,
    games: null,
    first_id: '10',
    first_name: 'Matty Jacko',
    second_id: '2',
    second_name: 'Ryan',
    third_id: null,
    third_name: null,
  },
  {
    id: '1',
    title: 'Summer Beer Pong tournament 2016',
    date: '2016-06-30T23:00:00.000Z',
    venue_id: '1',
    venue_title: 'Kingfisher Park',
    indoor: false,
    est: '2016-01-01T00:00:00.000Z',
    pitchsize: null,
    location: null,
    games: null,
    first_id: '1',
    first_name: 'MG',
    second_id: '5',
    second_name: 'Marc',
    third_id: null,
    third_name: null,
  },
];
