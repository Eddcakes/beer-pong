import express from 'express';
import Joi from 'joi';
import { poolPromise } from '../../db.js';

const schema = Joi.object().keys({
  playerName: Joi.string()
    .required()
    .messages({ 'string.base': 'A name must be entered' }),
});

const router = express.Router();

const insertNewPlayer = `
INSERT INTO ${process.env.DATABASE}.players
(name)
VALUES($1)
RETURNING id, name`;

const validateNewPlayer = (errorMessage) => (req, res, next) => {
  const newPlayerValid = schema.validate({
    playerName: req.body.playerName,
  });
  if (!newPlayerValid.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : newPlayerValid.error;
    res.status(422);
    next(error);
  }
};

router.post(
  '/new',
  validateNewPlayer('Could not create new player'),
  async (req, res, next) => {
    const values = [req.body.playerName];
    const client = await poolPromise.connect();
    try {
      const createNewPlayer = await client.query(insertNewPlayer, values);
      if (createNewPlayer) {
        res.json({
          message: 'New player created!',
          id: createNewPlayer.rows[0].id,
        });
      } else {
        const error = new Error('Could not create player');
        next(error);
      }
    } catch (err) {
      res.status(500);
      res.send(err.message);
    } finally {
      client.release();
    }
  }
);

export { router as postPlayer };
