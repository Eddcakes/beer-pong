import Joi from 'joi';

const authSchema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string().trim().min(6).required(),
});

export function isLoggedIn(req, res, next) {
  const { user } = req.session;
  if (!user) {
    const error = new Error('Unauthorised ⛔');
    res.status(401);
    next(error);
  }
  next();
}

export function isAdmin(req, res, next) {
  const { user } = req.session;
  if (Number(user.role_level) < 5) {
    const error = new Error('Unauthorised ⛔');
    res.status(401);
    next(error);
  }
  next();
}

export const validateUser = (defaultErrorMsg) => (req, res, next) => {
  const creds = authSchema.validate(req.body);
  if (!creds.error) {
    next();
  } else {
    const error = defaultErrorMsg ? new Error(defaultErrorMsg) : creds.error;
    res.status(422);
    next(error || creds.error);
  }
};

// error 422 helper function
export function respondError422(res, next) {
  res.status(422);
  const error = new Error(
    'Unable to login, please double check your credentials.'
  );
  next(error);
}
