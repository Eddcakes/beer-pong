import express from 'express';
import Joi from 'joi'; // joi or yup
import { poolPromise } from '../../db.js';

const schema = Joi.object().keys({
  avatar_link: Joi.string().trim().uri(),
});

const router = express.Router();

const selectUserPreferences = `
SELECT avatar_link as avatarLink, modified, user_id FROM ${process.env.DATABASE}.preferences WHERE user_id = $1`;

const insertUserPreferences = `
INSERT INTO ${process.env.DATABASE}.preferences (user_id, avatar_link) VALUES($1, $2)`;

router.get('/', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(selectUserPreferences, [
      req.session.user.id,
    ]);
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

router.post('/', async (req, res, next) => {
  const preferences = schema.validate({
    avatar_link: req.body.avatar_link,
  });
  if (preferences.error === undefined) {
    const client = await poolPromise.connect();
    try {
      //check that the user has any preferences
      const userPreferences = await client.query(`${selectUserPreferences}`, [
        req.session.user.id,
      ]);
      if (userPreferences.length > 0) {
        const update = `UPDATE ${process.env.DATABASE}.preferences
        SET avatar_link="${req.body.avatar_link}"
        WHERE user_id=${req.session.user.id}`;
        const updateUserPreferences = await client.query(update);
        if (updateUserPreferences) {
          res.json({ message: 'Preferences updated' });
        } else {
          const error = new Error('Could not update user preferences');
          next(error);
        }
      } else {
        const values = [req.session.user.id, req.body.avatar_link];
        const createUserPreferences = await client.query(
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
    } finally {
      client.release();
    }
  } else {
    // unprocessable entity, validation issue (using unuseable chars ect)
    res.status(422);
    next(new Error(preferences.error));
  }
});

export { router as userPreferences };
