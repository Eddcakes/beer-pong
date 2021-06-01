import express from 'express';
import Joi from 'joi'; // joi or yup
import { poolPromise } from '../../db.js';

const schema = Joi.object().keys({
  avatar_link: Joi.string().trim().uri(),
});

const router = express.Router();

const selectUserPreferences = `
SELECT avatar_link as avatarLink, modified, user_ID FROM ${process.env.DATABASE}.preferences WHERE user_ID = ?`;

const insertUserPreferences = `
INSERT INTO ${process.env.DATABASE}.preferences (user_ID, avatar_link) VALUES(?, ?)`;

router.get('/', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(
      selectUserPreferences,
      req.session.user.user_ID
    );
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

router.post('/', async (req, res, next) => {
  const preferences = schema.validate({
    avatar_link: req.body.avatar_link,
  });
  if (preferences.error === undefined) {
    let pool;
    try {
      pool = await poolPromise;
      //check that the user has any preferences
      const userPreferences = await pool.query(
        `${selectUserPreferences}`,
        req.session.user.user_ID
      );
      if (userPreferences.length > 0) {
        const update = `UPDATE ${process.env.DATABASE}.preferences
        SET avatar_link="${req.body.avatar_link}"
        WHERE user_ID=${req.session.user.user_ID}`;
        const updateUserPreferences = await pool.query(update);
        if (updateUserPreferences) {
          res.json({ message: 'Preferences updated' });
        } else {
          const error = new Error('Could not update user preferences');
          next(error);
        }
      } else {
        const values = [req.session.user.user_ID, req.body.avatar_link];
        const createUserPreferences = await pool.query(
          insertUserPreferences,
          values
        );
        if (createUserPreferences) {
          res.json({ message: 'Preferences created' });
        } else {
          const error = new Error('Could not create user preferences');
          next(error);
        }
      }
    } catch (err) {
      next(err);
    }
  } else {
    // unprocessable entity, validation issue (using unuseable chars ect)
    res.status(422);
    next(new Error(preferences.error));
  }
});

export { router as userPreferences };
