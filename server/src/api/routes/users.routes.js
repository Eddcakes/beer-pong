import { Router } from 'express';
import Joi from 'joi';
import { apiGetAllUsers, apiPatchUser } from './users.controller.js';

const schema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30),
  password: Joi.string().trim().min(6),
  role: Joi.string().valid('user', 'admin'),
  active: Joi.number().integer().max(1), //shithousery way of making boolean 😭
});

const validateUserDetails = (errorMessage) => (req, res, next) => {
  const userDetails = schema.validate(req.body);
  if (!userDetails.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : userDetails.error;
    res.status(422);
    next(error);
  }
};

export const usersRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetAllUsers(db));
  router.post(
    '/',
    validateUserDetails('User details did not pass validation'),
    apiPatchUser(db)
  );
  return router;
};
