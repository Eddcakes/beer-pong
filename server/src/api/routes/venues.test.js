import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getAllVenues = jest.fn(() => mockVenues);

const app = makeApp({
  getAllVenues,
});

const apiRoute = '/api/v1/venues';

describe('Venues routes tests', () => {
  test('Correctly calls get venues and shows mock data', async () => {
    await supertest(app).get(`${apiRoute}`);
    expect(getAllVenues.mock.calls.length).toBe(1);
    expect(getAllVenues.mock.results[0].value.length).toBe(2);
  });
});

const mockVenues = [
  {
    id: '1',
    title: 'Kingfisher Park',
    indoor: false,
    est: '2016-01-01T00:00:00.000Z',
    pitchsize: null,
    location: null,
  },
  {
    id: '2',
    title: 'Wills',
    indoor: false,
    est: '2016-01-01T00:00:00.000Z',
    pitchsize: null,
    location: null,
  },
];
