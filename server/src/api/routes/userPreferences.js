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
INSERT INTO ${process.env.DATABASE}.preferences (user_ID, avatar_link, modified) VALUES(?, ?, ?)`;

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
        //if they do, update
      } else {
        const values = [
          req.session.user.user_ID,
          req.body.avatar_link,
          new Date(),
        ]; //'NOW()' sets to 0000-00-00 00:00:00:00 ?
        const createUserPreferences = await pool.query(
          insertUserPreferences,
          values
        );
        //what do we want to do with the response?
        if (createUserPreferences) {
          res.json({ message: 'Preferences created' });
        } else {
          const error = new Error('Could not create user preferences');
          next(error);
        }
        //if they dont, post
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
