import bcrypt from 'bcryptjs';

import { respondError422 } from './auth.middlewares.js';
import { poolPromise } from '../../db.js';

const selectUserLoginWithRole = `
SELECT users.id,
users.email,
users.password,
users.username,
users.active,
roles.name as role_name,
roles.label as role_label,
roles.level as role_level
FROM ${process.env.DATABASE}.users
LEFT JOIN ${process.env.DATABASE}.roles ON users.role_id = roles.id
WHERE LOWER(users.username) = LOWER($1) AND active = true`;

export const signin = async (req, res, next) => {
  const client = await poolPromise.connect();
  try {
    const userData = await client.query(selectUserLoginWithRole, [
      req.body.username,
    ]);
    if (userData.rowCount > 0) {
      const { password, ...details } = userData.rows[0];
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
  } finally {
    client.release();
  }
};
