import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getCurrentRecords = jest.fn(() => mockRecords);
const getAllRecords = jest.fn();
const getRecordsByPlayerId = jest.fn();
const getRecordsByTypeId = jest.fn();

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
    expect(getCurrentRecords.mock.results[0].value).toStrictEqual(mockRecords);
    // map over results and expect all current === true
  });
  test.todo('get all records, include non current records');
  test.todo('get records by player id');
  test.todo('get records by player record type id');
});

const mockRecords = [
  {
    id: '12',
    label: 'most wins',
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
    description: null,
    player_id: '2',
    name: 'Ryan',
    value: '1',
    current: true,
    created: '2021-05-13T20:33:21.000Z',
    modified: '2021-05-13T20:33:21.000Z',
  },
];
