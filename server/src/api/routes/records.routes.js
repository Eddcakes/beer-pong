import { Router } from 'express';
import Joi from 'joi';
import { validPlayerId } from '../../middlewares.js';
import {
  apiGetCurrentRecords,
  apiGetAllRecords,
  apiGetRecordsByPlayerId,
  apiGetRecordsByTypeId,
} from './records.controller.js';

const typeId = Joi.object().keys({
  typeId: Joi.string().pattern(/^\d+$/, 'numbers').required(),
});

export const validTypeId = (errorMessage) => (req, res, next) => {
  const validId = typeId.validate({
    typeId: req.params.typeId,
  });
  if (!validId.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : validId.error;
    res.status(422);
    next(error);
  }
};

export const recordsRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetCurrentRecords(db));
  router.get('/all', apiGetAllRecords(db));
  router.get(
    '/player/:playerId',
    validPlayerId('Invalid player Id'),
    apiGetRecordsByPlayerId(db)
  );
  router.get(
    '/type/:typeId',
    validTypeId('Invalid type Id'),
    apiGetRecordsByTypeId(db)
  );
  return router;
};
