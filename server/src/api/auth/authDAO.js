import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../email/utils.js';

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

const updateUserPW = `UPDATE ${process.env.DATABASE}.users SET password=$1 WHERE username=$2`;

const selectByEmail = `
SELECT users.id,
users.username,
users.email,
users.password,
users.player_id,
users.active,
users.role,
EXTRACT (EPOCH FROM users.token_expires_at) as token_expires_at
FROM ${process.env.DATABASE}.users
WHERE lower(users.email) = $1 AND users.active = true`;

const updateResetTime = `
UPDATE ${process.env.DATABASE}.users 
SET token_expires_at=now()+interval '1 hours' 
WHERE lower(users.email) = $1 AND users.active = true`;

const selectByUsername = `
SELECT users.id,
users.username,
users.email,
users.password,
users.player_id,
users.active,
users.role 
FROM ${process.env.DATABASE}.users
WHERE lower(users.username) = $1 AND users.active = true`;

const resetMessage =
  'If a user with this email is found a reset link will be sent to the email';

let client;
let poolRef;
export default class AuthDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(`Unable to connect to connection pool in AuthDAO: ${err}`);
    } finally {
      client.release();
    }
  }
  static async signin(username, attemptedPassword) {
    try {
      const userData = await poolRef.query(selectUserLoginWithRole, [username]);
      if (userData.rowCount > 0) {
        const { password, ...details } = userData.rows[0];
        const compareHashedPassword = await bcrypt.compare(
          attemptedPassword,
          password
        );
        if (compareHashedPassword) {
          return details;
        } else {
          throw new Error('Unable to login');
        }
      } else {
        // cannot find username
        throw new Error('Unable to login');
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  static async signup(username, password) {
    if (process.env.DISABLE_SIGNUP === 'true') {
      // status 405, not allowed
      throw new Error('Sign up is currently disabled.');
    }
    try {
      const userData = await poolRef.query(selectUserByUsername, [username]);
      if (userData.rowCount > 0) {
        // status 409 (same username)
        throw new Error('Sorry username is taken. Please choose another one.');
      }
      const newHashedPass = await bcrypt.hash(password, 12);
      const signUpUser = await poolRef.query(insertUser, [
        username,
        newHashedPass,
      ]);
      if (signUpUser.rowCount > 0) {
        const { password, ...details } = signUpUser.rows[0];
        const newUserAndRole = await poolRef.query(selectUserWithRoleById, [
          details.id,
        ]);
        if (newUserAndRole.rowCount > 0) {
          // return user details to add to session
          const userDetails = newUserAndRole.rows[0];
          return userDetails;
        }
      }
      throw new Error('Could not find new user');
    } catch (err) {
      throw new Error(err);
    }
  }
  static async updatePassword(username, password) {
    try {
      const newHashedPass = await bcrypt.hash(password, 12);
      const updateUserPassword = await poolRef.query(updateUserPW, [
        newHashedPass,
        username,
      ]);
      return updateUserPassword.rows;
    } catch (err) {
      throw new Error(err);
    }
  }
  static async forgotPassword(email) {
    try {
      const foundEmail = await poolRef.query(selectByEmail, [email]);
      if (foundEmail.rowCount > 0) {
        const {
          username,
          email,
          password: hashedP,
          player_id,
          token_expires_at,
        } = foundEmail.rows[0];
        const tokenDetails = {
          username,
          email,
          player_id,
        };
        // if its within 10 mins of last request, send cool-down warning
        const hour = 60 * 60;
        // postgres epoch is in seconds
        const dbEpochTime = Math.trunc(Number(token_expires_at) - hour);
        // web epoch in milliseconds
        const nowEpoch = new Date().getTime() / 1000;
        const timeSinceReset = Math.trunc(nowEpoch) - dbEpochTime;
        if (timeSinceReset > 600) {
          const newToken = jwt.sign(tokenDetails, hashedP, { expiresIn: '1h' });
          const updateTime = await poolRef.query(updateResetTime, [email]);
          if (updateTime.rowCount > 0) {
            const opts = {
              subject: 'Pongleby password reset requested',
              text: `A password reset has been requested, ${process.env.FRONTEND_URL}/forgot-password/${newToken} to reset your password.`,
              html: `<p>A password reset has been requested, <a href="${process.env.FRONTEND_URL}/forgot-password/${newToken}" target="_blank">click here</a> to reset your password.</p>`,
            };
            await sendEmail(email, opts.subject, opts.text, opts.html);
          }
        } else {
          return {
            message:
              'Please wait at least 10 minutes before a new password reset',
          };
        }
      }
      return {
        message: resetMessage,
      };
    } catch (err) {
      console.error(err.message);
    }
  }
  static async resetForgotPassword(token, username, newPassword) {
    try {
      const decoded = jwt.decode(token);
      if (!(decoded.username.toLowerCase() === username)) {
        throw new Error('Decoded username does not match request');
      }
      const userDetails = await poolRef.query(selectByUsername, [username]);
      let secret = '';
      if (userDetails.rowCount > 0) {
        secret = userDetails.rows[0].password;
      }
      const validateJWT = jwt.verify(token, secret);
      if (validateJWT) {
        const newHashedPass = await bcrypt.hash(newPassword, 12);
        const updateUserPassword = await poolRef.query(updateUserPW, [
          newHashedPass,
          username,
        ]);
        return updateUserPassword.rows;
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
