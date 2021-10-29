import { Router } from 'express';
import { validateUser } from './auth.middlewares.js';
import { apiServerSignOut, apiSignin, apiSignup } from './auth.controller.js';

// replaces index.js

export const authRouter = (db) => {
  const router = new Router();
  router.get('/', async (req, res) => {
    res.json({ message: 'hitting auth endpoint ✨🔐' });
  });
  router.post('/signup', validateUser('Unable to sign up'), apiSignup(db));
  router.post('/signin', validateUser('Unable to login'), apiSignin(db));
  router.post('/signout', apiServerSignOut);
  //router.get('/:id', apiGetNewsById(db));
  return router;
};
