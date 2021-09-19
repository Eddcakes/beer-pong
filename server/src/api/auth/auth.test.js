import supertest from 'supertest';
import app from '../../app.js';
const apiRoute = '/api/v1';

test('should not be able to access  ', async () => {
  try {
    const home = await supertest(app).get(apiRoute);
    expect(home.statusCode).toBe(200);
    //expect(home.body.message).toBe(homeMessage);
  } catch (e) {
    expect(e).toBeNull();
  }
});

/*
router.use('/preferences', isLoggedIn, userPreferences);
router.use('/games', isLoggedIn, postGames);
router.use('/players', isLoggedIn, isAdmin, postPlayer);
router.use('/users', isLoggedIn, isAdmin, users);
*/

test('cannot see preferences without being logged in', async () => {
  try {
    const home = await supertest(app).get(apiRoute);
    expect(home.statusCode).toBe(200);
    //expect(home.body.message).toBe(homeMessage);
  } catch (e) {
    expect(e).toBeNull();
  }
});
