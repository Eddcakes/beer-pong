import { Router } from 'express';
import {
  apiOverviewByPlayerId,
  apiOverviewInvalid,
} from './overview.controller.js';

export const overviewRouter = (db) => {
  const router = new Router();
  router.get('/', apiOverviewInvalid);
  router.get('/:playerId', apiOverviewByPlayerId(db));
  return router;
};
