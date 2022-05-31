import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getNicknames = jest.fn(() => mockNicknames);
const getNicknameOfPlayerId = jest.fn((pId) =>
  mockNicknames.filter((nick) => nick.player_id === pId)
);

const app = makeApp({
  getNicknames,
  getNicknameOfPlayerId,
});

const apiRoute = '/api/v1/nicknames';

describe('nicknames routes mock tests', () => {
  test('Correctly calls get nicknames and shows mock data', async () => {
    await supertest(app).get(`${apiRoute}`);
    expect(getNicknames.mock.calls.length).toBe(1);
    expect(getNicknames.mock.results[0].value.length).toBe(5);
  });
  test('Get nicknames by player ID', async () => {
    await supertest(app).get(`${apiRoute}/player/2`);
    expect(getNicknameOfPlayerId.mock.calls.length).toBe(1);
    expect(getNicknameOfPlayerId.mock.results[0].value.length).toBe(2);
    // have to do deep compare on objects
    expect(getNicknameOfPlayerId.mock.results[0].value).toStrictEqual(
      mockPlayer2
    );
  });
  test('invalid player ids should return 422 error', async () => {
    await supertest(app).get(`${apiRoute}/player/frog`).expect(422);
  });
});

const mockPlayer2 = [
  {
    id: '2',
    player_id: '2',
    nick: 'Ryan',
  },
  {
    id: '5',
    player_id: '2',
    nick: 'The Big',
  },
];

const mockNicknames = [
  {
    id: '1',
    player_id: '1',
    nick: 'MG',
  },
  {
    id: '2',
    player_id: '2',
    nick: 'Ryan',
  },
  {
    id: '3',
    player_id: '4',
    nick: 'MD',
  },
  {
    id: '4',
    player_id: '3',
    nick: 'Edd',
  },
  {
    id: '5',
    player_id: '2',
    nick: 'The Big',
  },
];
