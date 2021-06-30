import bcrypt from 'bcryptjs';

import { poolPromise } from '../../db.js';

const selectUserByUsername = `
SELECT users.id,
users.username,
users.player_id,
users.active
FROM ${process.env.DATABASE}.users 
WHERE LOWER(users.username) = LOWER($1)`;

const insertUser = `
INSERT INTO ${process.env.DATABASE}.users
(username, password)
VALUES ($1, $2)
RETURNING id, email, username`;

/* not sure about returning a joined query so instead new query for session + role */
const selectUserWithRoleById = `
SELECT users.id,
users.email,
users.username,
users.active,
roles.name as role_name,
roles.label as role_label,
roles.level as role_level
FROM ${process.env.DATABASE}.users
LEFT JOIN ${process.env.DATABASE}.roles ON users.role_id = roles.id
WHERE users.id = $1 AND active = true`;

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
        //was popping password in order to add rest of details to session
        const { password, ...details } = signUpUser.rows[0];
        // now do new query to join with role and add to session
        const newUserAndRole = await client.query(selectUserWithRoleById, [
          details.id,
        ]);
        if (newUserAndRole.rowCount > 0) {
          const userDetails = newUserAndRole.rows[0];
          req.session.user = { ...userDetails };
          req.session.save();
          res.json({
            message: 'Successfully signed in',
            user: { ...userDetails },
          });
        }
        //successfully signed up, but cannot find entry
      }
    }
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
};
