import { Router } from 'express';
import { validPlayerId } from '../../middlewares.js';
import {
  apiOverviewByPlayerId,
  apiOverviewInvalid,
} from './overview.controller.js';

export const overviewRouter = (db) => {
  const router = new Router();
  router.get('/', apiOverviewInvalid);
  router.get(
    '/:playerId',
    validPlayerId('Invalid player Id'),
    apiOverviewByPlayerId(db)
  );
  return router;
};
