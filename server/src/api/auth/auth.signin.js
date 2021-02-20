import bcrypt from 'bcryptjs';

import { respondError422 } from './auth.middlewares.js';
import { poolPromise } from '../../db.js';

const selectUserLogin = `SELECT users.user_ID, users.email, users.password, users.username, users.active, users.role FROM users WHERE users.username = ? AND active = 1`;

export const signin = async (req, res, next) => {
  let pool;
  try {
    pool = await poolPromise;
    const userData = await pool.query(selectUserLogin, req.body.username);
    if (userData.length > 0) {
      const { password, ...details } = userData[0];
      const compareHashedPassword = await bcrypt.compare(
        req.body.password,
        password
      );
      if (compareHashedPassword) {
        req.session.user = { ...details };
        req.session.save();
        //console.log(req.session);
        res.json({
          message: 'Authentication successfull!',
          user: { ...details },
        });
      } else {
        respondError422(res, next);
      }
    } else {
      // username not found
      respondError422(res, next);
    }
  } catch (err) {
    next(err);
  }
};
