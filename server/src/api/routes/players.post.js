import express from 'express';
import Joi from 'joi';
import { poolPromise } from '../../db.js';

const schema = Joi.object().keys({
  playerName: Joi.string()
    .required()
    .messages({ 'string.base': 'A name must be entered' }),
});

const router = express.Router();

const selectPlayerByName = `
SELECT players.id,
players.name,
players.active
FROM ${process.env.DATABASE}.players 
WHERE LOWER(players.name) = LOWER($1)`;

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
      const checkPlayers = await client.query(selectPlayerByName, [
        req.body.playerName,
      ]);
      if (checkPlayers.rowCount > 0) {
        //user already exists with this username
        const playerAlreadyExists = new Error(
          'Sorry username is taken. Please choose another one.'
        );
        // conflict status code (same username)
        res.status(409);
        next(playerAlreadyExists);
      } else {
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
