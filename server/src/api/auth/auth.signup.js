import bcrypt from 'bcryptjs';

import { poolPromise } from '../../db.js';

const selectUserByUsername = `SELECT users.id, users.username, users.email, users.player_ID, users.active, users.role FROM ${process.env.DATABASE}.users WHERE users.username = $1 AND active = true`;
const insertUser = `INSERT INTO ${process.env.DATABASE}.users (username, password) VALUES ($1, $2) RETURNING id, email, username, role`;

export const signup = async (req, res, next) => {
  const client = await poolPromise.connect();
  try {
    //check username is unique
    const userData = await client.query(selectUserByUsername, [
      req.body.username,
    ]);
    // be able to disallow new accounts from env vars
    if (process.env.DISABLE_SIGNUP === 'true') {
      res.status(405); // Method Not allowed
      next(new Error('Sign up is currently disabled.'));
    } else if (userData.rowCount > 0) {
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
      const signUpUser = await client.query(insertUser, [
        req.body.username,
        newHashedPass,
      ]);
      // take a look at the extra postgres context we might have
      if (signUpUser.rowCount > 0) {
        const { password, ...details } = signUpUser.rows[0];
        //successfully signed up
        req.session.user = { ...details };
        req.session.save();
        //console.log(req.session.user);
        res.json({ message: 'Successfully signed in', user: { ...details } });
      }
    }
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};
