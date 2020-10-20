import express from 'express';
import bcrypt from 'bcryptjs';

import { poolPromise } from '../../db.js';
import { validateUser, createTokenResponse } from './auth.middlewares.js';
// todo rate limit

const selectUserByUsername = `SELECT users.user_ID, users.username, users.player_ID, users.active, users.role FROM users WHERE users.username = ?`;
const selectUserById = `SELECT users.user_ID, users.username, users.player_ID, users.active, users.role FROM users WHERE users.user_ID = ?`;
const selectUserLogin = `SELECT users.user_ID, users.password, users.username, users.active, users.role FROM users WHERE users.username = ?`;
const insertUser = 'INSERT INTO users (username, password) VALUES (?, ?)';
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ message: 'hitting auth endpoint ✨🔐' });
});

router.post('/signup', validateUser(), async (req, res, next) => {
  let pool;
  try {
    pool = await poolPromise;
    //check username is unique
    const userData = await pool.query(selectUserByUsername, req.body.username);

    if (userData && userData.length > 0) {
      //user already exists with this username
      const userAlreadyExists = new Error(
        'Sorry username is taken. Please choose another one.'
      );
      // conflict status code (same username)
      res.status(409);
      next(userAlreadyExists);
    } else {
      //create the new account
      const newHashedPass = await bcrypt.hash(req.body.password, 12);
      const signUpUser = await pool.query(insertUser, [
        req.body.username,
        newHashedPass,
      ]);
      if (signUpUser) {
        //successfully signed up
        const getNewUser = await pool.query(
          selectUserById,
          signUpUser.insertId
        );
        if (getNewUser) {
          createTokenResponse(getNewUser[0], res, next);
        }
      }
    }
  } catch (err) {
    next(err);
  }
});

router.post(
  '/signin',
  validateUser('Unable to login'),
  async (req, res, next) => {
    let pool;
    try {
      pool = await poolPromise;
      //check username is unique
      const userData = await pool.query(selectUserLogin, req.body.username);
      if (userData.length > 0) {
        //check if user is active
        if (userData[0].active === 1) {
          const compareHashedPassword = await bcrypt.compare(
            req.body.password,
            userData[0].password
          );
          if (compareHashedPassword) {
            createTokenResponse(userData[0], res, next);
          } else {
            respondError422(res, next);
          }
        } else {
          //bcause we throw it gets caught and respondError422 takes over
          throw new Error('User account inactive');
        }
      } else {
        // username not found
        respondError422(res, next);
      }
    } catch (err) {
      next(err);
    }
  }
);

// error 422 helper function
function respondError422(res, next) {
  res.status(422);
  const error = new Error(
    'Unable to login, please double check your credentials.'
  );
  next(error);
}

export { router as auth };
