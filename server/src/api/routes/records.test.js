import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getCurrentRecords = jest.fn(() =>
  mockRecords.filter((rec) => rec.current)
);
const getAllRecords = jest.fn(() => mockRecords);
const getRecordsByPlayerId = jest.fn((playerId) =>
  mockRecords.filter((record) => record.player_id === playerId)
);
const getRecordsByTypeId = jest.fn((typeId) =>
  mockRecords.filter((record) => record.record_type_id === typeId)
);

const app = makeApp({
  getCurrentRecords,
  getAllRecords,
  getRecordsByPlayerId,
  getRecordsByTypeId,
});

const apiRoute = '/api/v1/records';

describe('records routes mock tests', () => {
  test('Correctly calls get records and shows mock data', async () => {
    await supertest(app).get(`${apiRoute}`);
    expect(getCurrentRecords.mock.calls.length).toBe(1);
    expect(getCurrentRecords.mock.results[0].value.length).toBe(3);
  });
  test('get all records, include non current records', async () => {
    await supertest(app).get(`${apiRoute}/all`);
    expect(getAllRecords.mock.calls.length).toBe(1);
    expect(getAllRecords.mock.results[0].value.length).toBe(4);
    expect(getAllRecords.mock.results[0].value).toStrictEqual(mockRecords);
  });
  test('get records by player id', async () => {
    await supertest(app).get(`${apiRoute}/player/1`);
    expect(getRecordsByPlayerId.mock.calls.length).toBe(1);
    expect(getRecordsByPlayerId.mock.results[0].value.length).toBe(1);
  });
  test('get records by player record type id', async () => {
    await supertest(app).get(`${apiRoute}/type/2`);
    expect(getRecordsByTypeId.mock.calls.length).toBe(1);
    expect(getRecordsByTypeId.mock.results[0].value.length).toBe(1);
  });
});

const mockRecords = [
  {
    id: '13',
    label: 'something something darkslide',
    record_type_id: '13',
    description: null,
    player_id: '3',
    name: 'Edd',
    value: '1',
    current: false,
    created: '2021-05-13T20:33:21.000Z',
    modified: '2021-05-13T20:33:21.000Z',
  },
  {
    id: '12',
    label: 'most wins',
    record_type_id: '6',
    description: 'tbc exclude friendlies?',
    player_id: '1',
    name: 'MG',
    value: '16',
    current: true,
    created: '2021-05-13T21:14:39.000Z',
    modified: '2021-05-13T21:14:39.000Z',
  },
  {
    id: '11',
    label: 'most times bronze medal',
    record_type_id: '3',
    description: null,
    player_id: '3',
    name: 'Edd',
    value: '1',
    current: true,
    created: '2021-05-13T20:33:39.000Z',
    modified: '2021-05-13T20:33:42.000Z',
  },
  {
    id: '10',
    label: 'most times tournament runner up',
    record_type_id: '2',
    description: null,
    player_id: '2',
    name: 'Ryan',
    value: '1',
    current: true,
    created: '2021-05-13T20:33:21.000Z',
    modified: '2021-05-13T20:33:21.000Z',
  },
];
