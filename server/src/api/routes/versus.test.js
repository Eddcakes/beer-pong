import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getVersusResults = jest.fn(() => mockVersusResults);

const app = makeApp({
  getVersusResults,
});

const apiRoute = '/api/v1/versus';

describe('Versus routes mock tests', () => {
  test('should display user message when no names entered', async () => {
    const versusEndpoint = await supertest(app).get(`${apiRoute}`);
    expect(versusEndpoint.body.message).toBe(
      'Versus requires 2 IDs to compare'
    );
  });
  test('should display user message when 1 name entered', async () => {
    const versusEndpoint = await supertest(app).get(`${apiRoute}/1`);
    expect(versusEndpoint.body.message).toBe(
      'Versus requires 2 IDs to compare'
    );
  });
  test('should display versus results when 2 valid ids compared', async () => {
    await supertest(app).get(`${apiRoute}/1/2`);
    expect(getVersusResults.mock.calls.length).toBe(1);
    expect(getVersusResults.mock.results[0].value.length).toBe(3);
    expect(getVersusResults.mock.results[0].value).toStrictEqual(
      mockVersusResults
    );
  });
  test('versus with 2 invalid ids should return 422', async () => {
    await supertest(app).get(`${apiRoute}/frog/dog`).expect(422);
  });
  test('versus with p1 invalid ids should return 422', async () => {
    await supertest(app).get(`${apiRoute}/frog/2`).expect(422);
  });
  test('versus with p2 invalid ids should return 422', async () => {
    await supertest(app).get(`${apiRoute}/1/frog`).expect(422);
  });
});

//1 vs 2
const mockVersusResults = [
  {
    id: '1',
    venue_id: '1',
    date: '2016-06-30T23:00:00.000Z',
    home_id: '1',
    home_cups_left: 3,
    away_id: '2',
    away_cups_left: 0,
    tournament_id: '1',
    stage: 'group1',
    notes: null,
    home_name: 'MG',
    away_name: 'Ryan',
    event: 'Summer Beer Pong tournament 2016',
    venue: 'Kingfisher Park',
  },
  {
    id: '51',
    venue_id: '1',
    date: '2017-06-30T23:00:00.000Z',
    home_id: '2',
    home_cups_left: 2,
    away_id: '1',
    away_cups_left: 0,
    tournament_id: '2',
    stage: 'semi1',
    notes: null,
    home_name: 'Ryan',
    away_name: 'MG',
    event: 'Summer Beer Pong tournament 2017',
    venue: 'Kingfisher Park',
  },
  {
    id: '65',
    venue_id: '1',
    date: '2018-06-30T23:00:00.000Z',
    home_id: '2',
    home_cups_left: 2,
    away_id: '1',
    away_cups_left: 0,
    tournament_id: '3',
    stage: 'group2',
    notes: null,
    home_name: 'Ryan',
    away_name: 'MG',
    event: 'Summer Beer Pong tournament 2018',
    venue: 'Kingfisher Park',
  },
];
