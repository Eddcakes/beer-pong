import express from 'express';
import Joi from 'joi';
import { poolPromise } from '../../db.js';

const schema = Joi.object().keys({
  home_ID: Joi.number().required(),
  away_ID: Joi.number().required(),
  venue_ID: Joi.number().required(),
  created_by: Joi.number().required(),
  modified_by: Joi.number().required(),
});

const router = express.Router();

const insertNewGame = `
INSERT INTO ${process.env.DATABASE}.games 
(home_ID, away_ID, venue_ID, created_by, modified_by)
VALUES(?, ?, ?, ?, ?)
RETURNING game_ID, home_ID, away_ID`;

const validateNewGame = (errorMessage) => (req, res, next) => {
  const newGameValid = schema.validate({
    home_ID: req.body.player1,
    away_ID: req.body.player2,
    venue_ID: req.body.venue,
    created_by: req.session.user.user_ID,
    modified_by: req.session.user.user_ID,
  });
  if (!newGameValid.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : newGameValid.error;
    res.status(422);
    next(error);
  }
};

router.post(
  '/new',
  validateNewGame('Could not post new game'),
  async (req, res, next) => {
    const values = [
      req.body.player1,
      req.body.player2,
      req.body.venue,
      req.session.user.user_ID,
      req.session.user.user_ID,
    ];
    let pool;
    try {
      pool = await poolPromise;
      const createNewGame = await pool.query(insertNewGame, values);
      console.log(createNewGame);
      if (createNewGame) {
        res.json({
          message: 'New game created!',
          gameId: createNewGame[0].game_ID,
        });
      } else {
        const error = new Error('Could not create game');
        next(error);
      }
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  }
);

export { router as postGames };
