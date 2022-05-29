import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getNews = jest.fn(() => mockNews);
const getNewsById = jest.fn((byId) =>
  mockNews.find((news) => news.id === byId)
);

const app = makeApp({
  getNews,
  getNewsById,
});

const apiRoute = '/api/v1/news';

describe('news routes mock tests', () => {
  test('Correctly calls get news and shows mock data', async () => {
    await supertest(app).get(`${apiRoute}`);
    expect(getNews.mock.calls.length).toBe(1);
    expect(getNews.mock.results[0].value.length).toBe(2);
  });
  test('Get news by ID', async () => {
    await supertest(app).get(`${apiRoute}/${mockNews[0].id}`);
    expect(getNewsById.mock.calls.length).toBe(1);
    expect(getNewsById.mock.results[0].value).toBe(mockNews[0]);
  });
  test('invalid news ids should return 422 error', async () => {
    await supertest(app).get(`${apiRoute}/frog`).expect(422);
  });
});

const mockNews = [
  {
    id: '1',
    content: '## Test markdown',
    image_url: null,
    priority: null,
    approved: true,
    created: '2021-05-13T22:23:31.000Z',
    modified: '2021-05-15T16:57:46.000Z',
    created_by: '3',
    created_by_name: 'Edd',
    modified_by: '3',
    modified_by_name: 'Edd',
  },
  {
    id: '2',
    content: '## blank 2',
    image_url: null,
    priority: null,
    approved: true,
    created: '2021-06-09T20:34:47.575Z',
    modified: '2021-06-09T20:50:52.591Z',
    created_by: '3',
    created_by_name: 'Edd',
    modified_by: '3',
    modified_by_name: 'Edd',
  },
];
