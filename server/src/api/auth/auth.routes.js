import { Router } from 'express';
import {
  validateChangePassword,
  validateEmail,
  validateResetPassword,
  validateUser,
} from './auth.middlewares.js';
import {
  apiServerSignOut,
  apiSignin,
  apiSignup,
  apiUpdatePassword,
  apiForgotPassword,
  apiResetForgotPassword,
} from './auth.controller.js';

// replaces index.js

export const authRouter = (db) => {
  const router = new Router();
  router.get('/', async (req, res) => {
    res.json({ message: 'hitting auth endpoint ✨🔐' });
  });
  router.post('/signup', validateUser('Unable to sign up'), apiSignup(db));
  router.post('/signin', validateUser('Unable to login'), apiSignin(db));
  router.post('/signout', apiServerSignOut);
  router.post(
    '/update',
    validateChangePassword('Unable to change password'),
    apiUpdatePassword(db)
  );
  router.post(
    '/forgot-password',
    validateEmail('Requires valid email'),
    apiForgotPassword(db)
  );
  // add a validator
  router.post(
    '/reset-password/:token',
    validateResetPassword(),
    apiResetForgotPassword(db)
  );
  return router;
};
