import express from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi'; // joi or yup
import jwt from 'jsonwebtoken';
import { poolPromise } from '../../db.js';

// todo rate limit

const schema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(6).required(),
});

function createTokenResponse(user, res, next) {
  const payload = {
    id: user.user_ID,
    username: user.username,
  };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
    (err, token) => {
      if (err) {
        respondError422(res, next);
      } else {
        //respond with token
        res.json({ token: token });
      }
    }
  );
}

const selectUser = `SELECT users.username FROM users WHERE users.username = ?`;
const selectUserLogin = `SELECT users.user_ID, users.username, users.password FROM users WHERE users.username = ?`;
const insertUser = 'INSERT INTO users (username, password) VALUES (?, ?)';
// could use RETURNING if i want to return username?
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ message: 'hitting auth endpoint ✨🔐' });
});

router.post('/signup', async (req, res, next) => {
  const creds = schema.validate({
    username: req.body.username,
    password: req.body.password,
  });
  if (creds.error === undefined) {
    let pool;
    try {
      pool = await poolPromise;
      //check username is unique
      const userData = await pool.query(`${selectUser}`, req.body.username);

      if (userData.length > 0) {
        //user already exists with this username
        const userAlreadyExists = new Error(
          'Sorry username is taken. Please choose another one.'
        );
        // conflict status code (same username)
        res.status(409);
        next(userAlreadyExists);
      } else {
        //create the new account
        bcrypt.hash(req.body.password, 12).then(async (hashedPass) => {
          const signupUser = await pool.query(`${insertUser}`, [
            req.body.username,
            hashedPass,
          ]);
          createTokenResponse(signupUser, res, next);
        });
      }
    } catch (err) {
      next(err);
    }
  } else {
    // unprocessable entity, validation issue (using unuseable chars ect)
    res.status(422);
    next(creds.error);
  }
});

router.post('/signin', async (req, res, next) => {
  const creds = schema.validate({
    username: req.body.username,
    password: req.body.password,
  });
  if (creds.error === undefined) {
    let pool;
    try {
      pool = await poolPromise;
      //check username is unique
      const userData = await pool.query(
        `${selectUserLogin}`,
        req.body.username
      );
      if (userData.length > 0) {
        // found user now check password
        bcrypt
          .compare(req.body.password, userData[0].password)
          .then(async (loginResponse) => {
            if (loginResponse === true) {
              //user should be logged in
              createTokenResponse(userData, res, next);
            } else {
              respondError422(res, next);
            }
          })
          .catch((err) => {
            console.log('bcrypt promise err', err);
            respondError422(res, next);
          });
      } else {
        // username not found
        respondError422(res, next);
      }
    } catch (err) {
      next(err);
    }
  } else {
    // unprocessable entity, validation issue (using unuseable chars ect)
    respondError422(res, next);
  }
});

// error 422 helper function
function respondError422(res, next) {
  res.status(422);
  const error = new Error(
    'Unable to login, please double check your credentials.'
  );
  next(error);
}

export { router as auth };
