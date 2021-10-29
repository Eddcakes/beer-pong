import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

const getUserPreferences = jest.fn();
const postUserPreferences = jest.fn();

const app = makeApp({
  getUserPreferences,
  postUserPreferences,
});

const apiRoute = '/api/v1/preferences';

describe('user preferences demonstrate protected routes', () => {
  test('cannot read preferences without being logged in', async () => {
    try {
      const preferences = await supertest(app).get(`${apiRoute}`);
      expect(preferences.statusCode).toBe(401);
      expect(preferences.body.message).toBe('Unauthorised ⛔');
    } catch (e) {
      expect(e).toBeNull();
    }
  });
  test.todo('login to test user');

  /* async () => {
    // const testUser = await createTestUser();
    const testUsername = 'ApiTestUser';
    const pw = process.env.TEST_USER_PASS;
    try {
      const logIn = await supertest(app)
        .post('/api/v1/auth/signin')
        .send({ username: testUsername, password: pw });
      //agent.attachCookies();
      expect(logIn.body.message).toBe('Authentication successful!');
    } catch (err) {
      expect(err).toBeNull();
    }
  }); */
  // will this successfully pass session data?
  test.todo(
    'should now be able to read preferences, needs to pass authentication'
  );
});
