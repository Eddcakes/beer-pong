import express from 'express';
import morgan from 'morgan'; //logger
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import helmet from 'helmet';
import path from 'path';

import { notFound, errorHandler } from './middlewares.js';
import { api } from './api/index.js';
import { poolPromise } from './db.js';

const __dirname = path.resolve();

const app = express();

const pgs = pgSession(session);

const cookiesSecure = process.env.NODE_ENV.toLowerCase() === 'production';

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(morgan('common'));
app.use(
  session({
    store: new pgs({
      conString: process.env.DATABASE_URL,
      schemaName: process.env.DATABASE,
      pool: poolPromise,
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: Number(process.env.SESSION_MAX_AGE),
      secure: cookiesSecure,
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', api);

// in production use the build file, in dev run server & front end individually
// space in package.json as:production means we have to trim
if (process.env.NODE_ENV.toLowerCase().trim() === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`listening at ${process.env.DB_HOST}:${port}`);
});
