import { Router } from 'express';
import Joi from 'joi';
import {
  apiGetTournaments,
  apiGetRecentTournaments,
  apiGetTournamentById,
  apiPostNewTournament,
  apiGetParticipantsByTournamentId,
} from './tournaments.controller.js';
import { validId } from '../../middlewares.js';

const schema = Joi.object().keys({
  title: Joi.string().required(),
  date: Joi.string().required(),
  venue_id: Joi.number().required(),
});

const validateNewTournament = (errorMessage) => (req, res, next) => {
  const newGameValid = schema.validate({
    title: req.body.title,
    date: req.body.date,
    venue_id: req.body.venue,
  });
  if (!newGameValid.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : newGameValid.error;
    res.status(422);
    next(error);
  }
};

export const tournamentsRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetTournaments(db));
  router.get('/recent', apiGetRecentTournaments(db));
  router.get(
    '/:id',
    validId('Not a valid tournament ID'),
    apiGetTournamentById(db)
  );
  router.get(
    '/:id/participants',
    validId('Not a valid tournament ID'),
    apiGetParticipantsByTournamentId(db)
  );
  return router;
};

export const tournamentsProtectedRoutes = (db) => {
  const router = new Router();
  router.post(
    '/new',
    validateNewTournament('Could not post new tournament'),
    apiPostNewTournament(db)
  );
  // router.post('/:id', validId('Not a valid game ID'), apiPatchTournament(db));
  return router;
};
