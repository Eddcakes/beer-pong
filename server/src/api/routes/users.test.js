import supertest from 'supertest';
import makeApp from '../../app.js';
import { jest } from '@jest/globals';

/* mock db calls */
const getAllUsers = jest.fn();
const patchUser = jest.fn();

const app = makeApp({
  getAllUsers,
  patchUser,
});

const apiRoute = '/api/v1/users';

describe('users routes mock tests', () => {
  test.todo('get all users should be protected by isLoggedIn');
  test.todo('patch user should be protected by validateUserDetails');
  test.todo('get records by player record type id');
});
