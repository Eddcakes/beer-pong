import supertest from 'supertest';

import app from './app.js';

const homeMessage = '🍺 bp app in development, route under construction';

const apiRoute = '/api/v1';

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
