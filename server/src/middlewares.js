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

export { notFound, errorHandler };
