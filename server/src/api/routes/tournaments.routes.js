import { Router } from 'express';
import {
  apiGetTournaments,
  apiGetRecentTournaments,
  apiGetTournamentById,
} from './tournaments.controller.js';

export const tournamentsRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetTournaments(db));
  router.get('/recent', apiGetRecentTournaments(db));
  router.get('/:id', apiGetTournamentById(db));
  return router;
};
