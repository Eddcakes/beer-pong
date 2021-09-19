import express from 'express';

import { validateUser } from './auth.middlewares.js';
import { signin } from './auth.signin.js';
import { signup } from './auth.signup.js';
import { serverSignOut } from './auth.signout.js';
// todo rate limit

const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ message: 'hitting auth endpoint ✨🔐' });
});

router.post('/signup', validateUser('Unable to sign up'), signup);
router.post('/signin', validateUser('Unable to login'), signin);
router.post('/signout', serverSignOut);

export { router as auth };
