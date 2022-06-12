import { Router } from 'express';
import Joi from 'joi';
import {
  apiGetPlayers,
  apiGetPlayerById,
  apiPostNewPlayer,
} from './players.controller.js';
import { validId } from '../../middlewares.js';

const schema = Joi.object().keys({
  playerName: Joi.string().trim().min(2),
});

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

export const playersRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetPlayers(db));
  router.get('/:id', validId('Not a valid player ID'), apiGetPlayerById(db));
  return router;
};

export const playersProtectedRoutes = (db) => {
  const router = new Router();
  router.post(
    '/new',
    validateNewPlayer('Could not create new player'),
    apiPostNewPlayer(db)
  );
  return router;
};
