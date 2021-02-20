import bcrypt from 'bcryptjs';

import { poolPromise } from '../../db.js';

const selectUserByUsername = `SELECT users.user_ID, users.username, users.email, users.player_ID, users.active, users.role FROM users WHERE users.username = ? AND active = 1`;
const insertUser =
  'INSERT INTO users (username, password) VALUES (?, ?) RETURNING user_ID, email, username, role';

export const signup = async (req, res, next) => {
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
        const { password, ...details } = signUpUser[0];
        //successfully signed up
        req.session.user = { ...details };
        req.session.save();
        console.log(req.session.user);
        res.json({ message: 'Successfully signed in', user: { ...details } });
      }
    }
  } catch (err) {
    next(err);
  }
};
