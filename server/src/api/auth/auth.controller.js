import { respondError422 } from './auth.middlewares.js';

export const apiSignin = (db) => async (req, res, next) => {
  try {
    const userDetails = await db.signin(req.body.username, req.body.password);
    // returns the user details
    if (userDetails) {
      req.session.user = userDetails;
      req.session.save();
      res.json({
        message: 'Authentication successful!',
        user: userDetails,
      });
    }
  } catch (err) {
    if (String(err).includes('Unable to login')) {
      return respondError422(res, next);
    }
    res.status(500);
    res.send(err);
  }
};

export const apiServerSignOut = async (req, res, next) => {
  req.session.destroy();
  res.json({ message: 'successfully logged out' });
};

export const apiSignup = (db) => async (req, res, next) => {
  try {
    const userDetails = await db.signup(req.body.username, req.body.password);
    if (userDetails) {
      req.session.user = userDetails;
      req.session.save();
      res.json({
        message: 'Successfully signed in',
        user: userDetails,
      });
    }
  } catch (err) {
    const errString = String(err);
    if (errString.includes('Sorry username is taken')) {
      res.status(409);
      next(err);
    }
    if (errString.includes('disabled')) {
      res.status(405); // Method Not Allowed
      next(err);
    }
    next(err);
  }
};

export const apiUpdatePassword = (db) => async (req, res, next) => {
  try {
    const checkDetails = await db.signin(
      req.body.username,
      req.body.currentPassword
    );
    // if correct current password now we can save the new one
    if (checkDetails) {
      const updatePassword = await db.updatePassword(
        req.body.username,
        req.body.newPassword
      );
      if (updatePassword) {
        res.json({
          message: 'Updated password',
        });
      }
    }
  } catch (err) {
    if (String(err).includes('Unable to login')) {
      return respondCheckPassword(res, next);
    }
    res.status(500);
    res.send(err);
  }
};

function respondCheckPassword(res, next) {
  res.status(401);
  const error = new Error('Current password does not match');
  next(error);
}

export const apiForgotPassword = (db) => async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const forgotPassword = await db.forgotPassword(email);
    res.json({ message: forgotPassword.message });
  } catch (err) {
    res.status(500);
    next(err);
  }
};

export const apiResetForgotPassword = (db) => async (req, res, next) => {
  try {
    const { token } = req.params;
    const { username, newPassword } = req.body;
    const resetPassword = await db.resetForgotPassword(
      token,
      username.toLowerCase(),
      newPassword
    );
    if (resetPassword) {
      res.json({
        message: 'Updated password',
      });
    }
  } catch (err) {
    const stringErr = String(err);
    if (
      stringErr.includes('TokenExpiredError') ||
      stringErr.includes('invalid signature')
    ) {
      res.status(401);
      next(
        new Error(
          'Token has expired, a new password reset is required if you still want to change your password.'
        )
      );
    }
    next(err);
  }
};
