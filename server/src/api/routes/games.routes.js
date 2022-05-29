import { Router } from 'express';
import Joi from 'joi';
import {
  apiGetGames,
  apiGetGameById,
  apiGetRecentGamesByPlayerId,
  apiGetTournamentGamesById,
  apiPostNewGame,
  apiPatchGame,
} from './games.controller.js';
import { validId } from '../../middlewares.js';

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

export const gamesRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetGames(db));
  router.get('/:id', validId('Not a valid game ID'), apiGetGameById(db));
  router.get(
    '/tournament/:id',
    validId('Not a valid tournament ID'),
    apiGetTournamentGamesById(db)
  );
  router.get(
    '/recent/:id',
    validId('Not a valid player ID'),
    apiGetRecentGamesByPlayerId(db)
  );
  return router;
};

export const gamesProtectedRoutes = (db) => {
  const router = new Router();
  router.post(
    '/new',
    validateNewGame('Could not post new game'),
    apiPostNewGame(db)
  );
  router.post('/:id', validId('Not a valid game ID'), apiPatchGame(db));
  return router;
};
