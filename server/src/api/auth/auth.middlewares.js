import jwt from 'jsonwebtoken';

import { authSchema } from './auth.schema.js';

export function checkTokenSetUser(req, res, next) {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          // console.log(err);
        }
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

export function createTokenResponse(user, res, next) {
  const payload = {
    id: user.user_ID,
    username: user.username,
    playerId: user.player_ID,
    active: user.active,
    role: user.role,
  };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
    (err, token) => {
      if (err) {
        respondError422(res, next);
      } else {
        //respond with token
        res.json({ token: token });
      }
    }
  );
}

export function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    const error = new Error('Unauthorised ⛔');
    res.status(401);
    next(error);
  }
}

export function isAdmin(req, res, next) {
  if (req.user.role === 'admin') {
    next();
  } else {
    const error = new Error('Unauthorised ⛔');
    res.status(401);
    next(error);
  }
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
