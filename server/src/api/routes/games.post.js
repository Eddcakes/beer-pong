import express from 'express';
import Joi from 'joi';
import { poolPromise } from '../../db.js';

const tableSchema = Joi.object()
  .keys({
    homeCups: Joi.array(),
    preRackHomeCups: Joi.object().allow(null),
    awayCups: Joi.array(),
    preRackAwayCups: Joi.object().allow(null),
    firstThrow: Joi.number().allow(null),
    homeCupsLeft: Joi.number(),
    homeCupRerackComplete: Joi.boolean(),
    homeCupRimCount: Joi.number(),
    awayCupsLeft: Joi.number(),
    awayCupRerackComplete: Joi.boolean(),
    awayCupRimCount: Joi.number(),
    forfeit: Joi.boolean(),
    turns: Joi.number(),
    selectedCup: Joi.object().allow(null),
    isHovering: Joi.boolean(),
    lastHover: Joi.object().keys({
      x: Joi.number().allow(null),
      y: Joi.number().allow(null),
    }),
    cupNewPos: Joi.object().keys({
      x: Joi.number().allow(null),
      y: Joi.number().allow(null),
    }),
    winner: Joi.number().allow(null),
    stack: Joi.array().allow(null),
  })
  .allow(null);

const schema = Joi.object().keys({
  home_ID: Joi.number().required(),
  away_ID: Joi.number().required(),
  homeCupsLeft: Joi.number().required(),
  awayCupsLeft: Joi.number().required(),
  venue_ID: Joi.number().required(),
  forfeit: Joi.boolean().required(),
  created_by: Joi.number().required(),
  modified_by: Joi.number().required(),
  game_table: tableSchema,
});

const router = express.Router();

const insertNewGame = `
INSERT INTO ${process.env.DATABASE}.games 
(home_ID,
  away_ID,
  homeCupsLeft,
  awayCupsLeft,
  venue_ID,
  forfeit,
  created_by,
  modified_by,
  game_table)
VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING game_ID, home_ID, away_ID`;

/* whats hitting error */
const validateNewGame = (errorMessage) => (req, res, next) => {
  const newGameValid = schema.validate({
    home_ID: req.body.player1,
    away_ID: req.body.player2,
    homeCupsLeft: req.body.homeCupsLeft,
    awayCupsLeft: req.body.awayCupsLeft,
    venue_ID: req.body.venue,
    forfeit: req.body.homeForfeit || req.body.awayForfeit,
    created_by: req.session.user.user_ID,
    modified_by: req.session.user.user_ID,
    game_table: req.body.table,
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
      req.body.homeCupsLeft,
      req.body.awayCupsLeft,
      req.body.venue,
      req.body.forfeit ? 1 : 0,
      req.session.user.user_ID,
      req.session.user.user_ID,
      req.body.table,
    ];
    let pool;
    try {
      pool = await poolPromise;
      const createNewGame = await pool.query(insertNewGame, values);
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

// update game details
router.post(
  '/:id',
  //validateNewGame('Could not post new game'),
  async (req, res, next) => {
    let pool;
    try {
      const updateSql = `UPDATE ${process.env.DATABASE}.games 
    SET 
    homeCupsLeft=${req.body.homeCupsLeft},
    awayCupsLeft=${req.body.awayCupsLeft},
    game_table='${req.body.table}'
    WHERE game_ID = ?`;
      pool = await poolPromise;
      const updateGame = await pool.query(updateSql, req.params.id);
      if (updateGame) {
        res.json({
          message: 'game updated!',
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
