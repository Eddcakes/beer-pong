import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { poolPromise } from '../../db.js';

const schema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30),
  password: Joi.string().trim().min(6),
  role: Joi.string().valid('user', 'admin'),
  active: Joi.number().integer().max(1), //shithousery way of making boolean 😭
});

const router = express.Router();

const allUsers = `
SELECT user_ID, username, player_ID, active, role FROM ${process.env.DATABASE}.users`;

const getUser = `SELECT user_ID, username, player_ID, active, role FROM ${process.env.DATABASE}.users WHERE user_ID = ?`;

// why doesnt this work, o shit i think parameters have to be 1 thing, not strings
//const updateUser = `UPDATE ${process.env.DATABASE}.users SET ? WHERE user_ID = ?`;
/* pool.query(updateUser, [sqlParam, req.params.id]) */

router.get('/', async (req, res, next) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(allUsers);
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  let pool;
  try {
    const checkUsers = schema.validate(req.body);
    if (!checkUsers.error) {
      pool = await poolPromise;
      const dbResponse = await pool.query(getUser, req.params.id);
      if (dbResponse.length > 0) {
        //update user
        const data = req.body;
        if (data.password) {
          data.password = await bcrypt.hash(data.password, 12);
        }
        // mariadb connector doesnt let us update data from js object/json so needs some formatting
        const dataArray = Object.keys(data).map((col) => {
          return `${col} = '${data[col]}'`;
        });
        const sqlParam = dataArray.join(', ');
        const rebuildQuery = `UPDATE ${process.env.DATABASE}.users SET ${sqlParam} WHERE user_ID = ?`;
        const dbUpdate = await pool.query(rebuildQuery, req.params.id);
        if (dbUpdate) {
          //get updated response to res.json
          res.json({ message: `User ${req.params.id} updated` });
          //return res.json(user);
        } else {
          throw new Error('dbUpdate.error');
        }
      } else {
        res.status(422);
        throw new Error('Cannot find user');
      }
    } else {
      res.status(422);
      throw new Error(checkUsers.error);
    }
  } catch (err) {
    next(err);
  }
});

export { router as users };
