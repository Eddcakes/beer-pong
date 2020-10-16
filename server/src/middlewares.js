import jwt from 'jsonwebtoken';

const notFound = (req, res, next) => {
  const error = new Error(`Path not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// must have all 4 params to use error
const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: statusCode,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '⚠🥞⚠' : error.stack,
    error: error.message,
  });
};

function checkTokenSetUser(req, res, next) {
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

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    const error = new Error('Unauthorised ⛔');
    res.status(401);
    next(error);
  }
}

export { notFound, errorHandler, checkTokenSetUser, isLoggedIn };
