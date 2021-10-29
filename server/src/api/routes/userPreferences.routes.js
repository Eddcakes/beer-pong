import { Router } from 'express';
import Joi from 'joi';
import {
  apiGetUserPreferences,
  apiPostUserPreferences,
} from './userPreferences.controller.js';

const schema = Joi.object().keys({
  avatar_link: Joi.string().trim().uri(),
});

const validatePreferences = (errorMessage) => (req, res, next) => {
  const preferences = schema.validate({
    avatar_link: req.body.avatar_link,
  });
  if (!preferences.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : preferences.error;
    res.status(422);
    next(error);
  }
};

export const userPreferencesRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetUserPreferences(db));
  router.post(
    '/',
    validatePreferences('User preferences did not pass validation'),
    apiPostUserPreferences(db)
  );
  return router;
};
