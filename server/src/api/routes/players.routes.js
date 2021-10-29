import { Router } from 'express';
import {
  apiGetPlayers,
  apiGetPlayerById,
  apiPostNewPlayer,
} from './players.controller.js';

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
  router.get('/:id', apiGetPlayerById(db));
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
