import { Router } from 'express';
import {
  apiGetGames,
  apiGetGameById,
  apiGetRecentGamesByPlayerId,
  apiGetTournamentGamesById,
} from './games.controller.js';

export const gamesRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetGames(db));
  router.get('/:id', apiGetGameById(db));
  router.get('/tournament/:id', apiGetTournamentGamesById(db));
  router.get('/recent/:id', apiGetRecentGamesByPlayerId(db));
  return router;
};
