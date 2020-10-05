import express from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi'; // joi or yup
import { poolPromise } from '../../db.js';

const schema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(6).required(),
});

const selectUser = `SELECT users.username FROM users WHERE users.username = ?`;
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
          res.json(signupUser);
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

export { router as auth };
