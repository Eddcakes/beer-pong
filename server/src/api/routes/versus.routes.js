import { Router } from 'express';
import Joi from 'joi';
import { apiVersusInvalid, apiGetVersusResults } from './versus.controller.js';

const versusP1P2 = Joi.object().keys({
  p1Id: Joi.string().pattern(/^\d+$/, 'numbers').required(),
  p2Id: Joi.string().pattern(/^\d+$/, 'numbers').required(),
});

const versusCheckId = (errorMessage) => (req, res, next) => {
  const versusValid = versusP1P2.validate({
    p1Id: req.params.p1Id,
    p2Id: req.params.p2Id,
  });
  if (!versusValid.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : versusValid.error;
    res.status(422);
    next(error);
  }
};

export const versusRouter = (db) => {
  const router = new Router();
  router.get('/', apiVersusInvalid);
  router.get('/:p1Id', apiVersusInvalid);
  router.get(
    '/:p1Id/:p2Id',
    versusCheckId('Invalid versus Ids'),
    apiGetVersusResults(db)
  );
  return router;
};
