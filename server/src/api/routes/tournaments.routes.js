import { Router } from 'express';
import {
  apiGetTournaments,
  apiGetRecentTournaments,
  apiGetTournamentById,
} from './tournaments.controller.js';
import { validId } from '../../middlewares.js';

export const tournamentsRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetTournaments(db));
  router.get('/recent', apiGetRecentTournaments(db));
  router.get(
    '/:id',
    validId('Not a valid tournament ID'),
    apiGetTournamentById(db)
  );
  return router;
};
