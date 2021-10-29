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
