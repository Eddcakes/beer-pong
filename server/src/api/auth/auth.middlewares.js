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

const changePasswordSchema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30)
    .required(),
  currentPassword: Joi.string().trim().min(6).required(),
  newPassword: Joi.string().trim().min(6).required(),
});

const emailSchema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required(),
});

const sendEmailSchema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required(),
  subject: Joi.string().trim().min(3).required(),
  text: Joi.string().min(3).required(),
  html: Joi.string(),
});

export function isLoggedIn(req, res, next) {
  const { user } = req?.session || {};
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

export const validateChangePassword = (msg) => (req, res, next) => {
  const changePassword = changePasswordSchema.validate(req.body);
  if (!changePassword.error) {
    next();
  } else {
    const error = msg ? new Error(msg) : changePassword.error;
    res.status(422);
    next(error || changePassword.error);
  }
};

export const validateEmail = (defaultErrorMsg) => (req, res, next) => {
  const validEmail = emailSchema.validate(req.body);
  if (!validEmail.error) {
    next();
  } else {
    const error = defaultErrorMsg
      ? new Error(defaultErrorMsg)
      : validEmail.error;
    res.status(422);
    next(error || validEmail.error);
  }
};

const validateEmailMessage = (errorMessage) => (req, res, next) => {
  const emailDetails = sendEmailSchema.validate(req.body);
  if (!emailDetails.error) {
    next();
  } else {
    const error = errorMessage ? new Error(errorMessage) : emailDetails.error;
    res.status(400);
    next(error);
  }
};

const resetPasswordSchema = Joi.object().keys({
  username: Joi.string()
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/)
    .min(2)
    .max(30)
    .required(),
  newPassword: Joi.string().trim().min(6).required(),
});

const tokenSchema = Joi.string().required();

export const validateResetPassword = () => (req, res, next) => {
  const details = resetPasswordSchema.validate(req.body);
  const token = tokenSchema.validate(req.params.token);
  if (details.error) {
    const error = new Error('Error with new credentials');
    res.status(400);
    next(error);
  } else if (token.error) {
    const error = new Error('Error with new token');
    res.status(400);
    next(error);
  } else {
    next();
  }
};
