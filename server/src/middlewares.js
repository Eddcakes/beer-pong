import Joi from 'joi';

export const notFound = (req, res, next) => {
  const error = new Error(`Path not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// must have all 4 params to use error
export const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: statusCode,
    message: error.message,
    stack:
      process.env.NODE_ENV.toLowerCase() === 'production'
        ? '⚠🥞⚠'
        : error.stack,
    error: error.message,
  });
};

const stringId = Joi.object().keys({
  id: Joi.string().pattern(/^\d+$/, 'numbers').required(),
});

export const validId = (errorMessage) => (req, res, next) => {
  const validId = stringId.validate({
    id: req.params.id,
  });
  if (!validId.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : validId.error;
    res.status(422);
    next(error);
  }
};

const playerStringId = Joi.object().keys({
  playerId: Joi.string().pattern(/^\d+$/, 'numbers').required(),
});

export const validPlayerId = (errorMessage) => (req, res, next) => {
  const validId = playerStringId.validate({
    playerId: req.params.playerId,
  });
  if (!validId.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : validId.error;
    res.status(422);
    next(error);
  }
};
