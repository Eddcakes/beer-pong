import { Router } from 'express';
import { apiVersusInvalid, apiGetVersusResults } from './versus.controller.js';

export const versusRouter = (db) => {
  const router = new Router();
  router.get('/', apiVersusInvalid);
  router.get('/:p1Id/:p2Id', apiGetVersusResults(db));
  return router;
};
