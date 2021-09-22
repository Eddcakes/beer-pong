import { Router } from 'express';
import {
  apiGetCurrentRecords,
  apiGetAllRecords,
  apiGetRecordsByPlayerId,
  apiGetRecordsByTypeId,
} from './records.controller.js';

export const recordsRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetCurrentRecords(db));
  router.get('/all', apiGetAllRecords(db));
  router.get('/player/:playerId', apiGetRecordsByPlayerId(db));
  router.get('/type/:typeId', apiGetRecordsByTypeId(db));
  return router;
};
