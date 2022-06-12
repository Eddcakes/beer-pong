import { Router } from 'express';
import Joi from 'joi';
import { apiConfirmEmail } from './email.controller.js';

// maybe middlewhere to check user and email exists
// move into auth possibly?

const schema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required(),
  subject: Joi.string().trim().min(3).required(),
  text: Joi.string().min(3).required(),
});

const validateMessage = (errorMessage) => (req, res, next) => {
  const emailDetails = schema.validate(req.body);
  if (!emailDetails.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : emailDetails.error;
    res.status(400);
    next(error);
  }
};

export const emailRouter = (db) => {
  const router = new Router();
  router.post(
    '/',
    validateMessage('Error with email options'),
    apiConfirmEmail(db)
  );
  // router.get('/:id', validId('Not a valid news ID'), apiGetNewsById(db));
  return router;
};
