import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getPlayers = jest.fn(() => mockPlayers);
const getPlayerById = jest.fn((id) =>
  mockPlayers.filter((player) => player.id === id)
);
const postNewPlayer = jest.fn();

const app = makeApp({
  getPlayers,
  getPlayerById,
  postNewPlayer,
});

const apiRoute = '/api/v1/players';

describe('players routes mock tests', () => {
  test('Correctly calls get players and shows mock data', async () => {
    await supertest(app).get(`${apiRoute}`);
    expect(getPlayers.mock.calls.length).toBe(1);
    expect(getPlayers.mock.results[0].value.length).toBe(4);
    expect(getPlayers.mock.results[0].value).toStrictEqual(mockPlayers);
  });
  test('Get player by id', async () => {
    await supertest(app).get(`${apiRoute}/3`);
    expect(getPlayerById.mock.calls.length).toBe(1);
    expect(getPlayerById.mock.results[0].value).toStrictEqual([
      {
        id: '3',
        name: 'Edd',
        active: true,
      },
    ]);
  });
  test('invalid player ids should return 422 error', async () => {
    await supertest(app).get(`${apiRoute}/frog`).expect(422);
  });
  test.todo('test post request to create new player');
  test.todo('test post new player passes validation');
  /*('Add a new player', async () => {
    await supertest(app).post(`${apiRoute}/new`).send();
  }) */
});

const mockPlayers = [
  {
    id: '1',
    name: 'MG',
    active: true,
  },
  {
    id: '2',
    name: 'Ryan',
    active: false,
  },
  {
    id: '3',
    name: 'Edd',
    active: true,
  },
  {
    id: '4',
    name: 'MD',
    active: true,
  },
];
