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
  home_id: Joi.number().required(),
  away_id: Joi.number().required(),
  homeCupsLeft: Joi.number().required(),
  awayCupsLeft: Joi.number().required(),
  venue_id: Joi.number().required(),
  forfeit: Joi.boolean().required(),
  created_by: Joi.number().required(),
  modified_by: Joi.number().required(),
  game_table: tableSchema,
});

const router = express.Router();

const insertNewGame = `
INSERT INTO ${process.env.DATABASE}.games 
(home_id,
  away_id,
  home_cups_left,
  away_cups_left,
  venue_id,
  forfeit,
  created_by,
  modified_by,
  game_table,
  locked)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING id, home_id, away_id`;

const whereGameId = `WHERE games.id = $1`;

/* whats hitting error */
const validateNewGame = (errorMessage) => (req, res, next) => {
  const newGameValid = schema.validate({
    home_id: req.body.player1,
    away_id: req.body.player2,
    homeCupsLeft: req.body.homeCupsLeft,
    awayCupsLeft: req.body.awayCupsLeft,
    venue_id: req.body.venue,
    forfeit: req.body.homeForfeit || req.body.awayForfeit,
    created_by: req.session.user.id,
    modified_by: req.session.user.id,
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
      false,
      req.session.user.id,
      req.session.user.id,
      req.body.table,
      req.body.locked,
    ];
    const client = await poolPromise.connect();
    try {
      const createNewGame = await client.query(insertNewGame, values);
      if (createNewGame) {
        res.json({
          message: 'New game created!',
          id: createNewGame.rows[0].id,
        });
      } else {
        const error = new Error('Could not create game');
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

router.post(
  '/:id',
  //validateNewGame('Could not post new game'),
  async (req, res, next) => {
    const client = await poolPromise.connect();
    try {
      const lockOnWin =
        req.body.homeCupsLeft === 0 || req.body.awayCupsLeft === 0
          ? 'locked=true,'
          : '';
      const updateSql = `UPDATE ${process.env.DATABASE}.games 
      SET ${lockOnWin}
      home_cups_left=$1,
      away_cups_left=$2,
      game_table=$3
      WHERE ${process.env.DATABASE}.games.id=$4
      `;
      const updateGame = await client.query(updateSql, [
        req.body.homeCupsLeft,
        req.body.awayCupsLeft,
        req.body.table,
        req.params.id,
      ]);
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
    } finally {
      client.release();
    }
  }
);

export { router as postGames };
