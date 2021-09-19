import supertest from 'supertest';
import app from '../../app.js';

const apiRoute = '/api/v1/preferences';
const request = supertest(app);

describe('protected routes', () => {
  test('cannot read preferences without being logged in', async () => {
    try {
      const preferences = await request.get(apiRoute);
      expect(preferences.statusCode).toBe(401);
      expect(preferences.body.message).toBe('Unauthorised ⛔');
    } catch (e) {
      expect(e).toBeNull();
    }
  });
  /* works but hangs on process.exit so prob need to do a different way rather than createTestUser() */
  test('login to test user', async () => {
    // const testUser = await createTestUser();

    const testUsername = 'ApiTestUser';
    const pw = process.env.TEST_USER_PASS;
    try {
      const logIn = await request
        .post('/api/v1/auth/signin')
        .send({ username: testUsername, password: pw });
      //agent.attachCookies();
      expect(logIn.body.message).toBe('Authentication successful!');
    } catch (err) {
      expect(err).toBeNull();
    }
  });
  // will this successfully pass session data?
  test.todo(
    'should now be able to read preferences, needs to pass authentication'
  );
});
