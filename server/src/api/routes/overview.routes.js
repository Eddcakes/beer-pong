import { Router } from 'express';
import { apiOverviewByPlayerId } from './overview.controller.js';

export const overviewRouter = (db) => {
  const router = new Router();
  router.get('/:playerId', apiOverviewByPlayerId(db));
  return router;
};
