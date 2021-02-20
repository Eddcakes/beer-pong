import { authSchema } from './auth.schema.js';

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
  if (user.role !== 'admin') {
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
