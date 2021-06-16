import express from 'express';
import morgan from 'morgan'; //logger
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

import { notFound, errorHandler } from './middlewares.js';
import { api } from './api/index.js';
import { poolPromise } from './db.js';

const app = express();

const pgs = pgSession(session);

const constring = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.PGDATABASE}`;

const cookiesSecure = process.env.NODE_ENV.toLowerCase() === 'production';

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(morgan('common'));
app.use(
  session({
    store: new pgs({
      conString: constring,
      schemaName: process.env.DATABASE,
      pool: poolPromise,
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
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

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`listening at ${process.env.DB_HOST}:${port}`);
});
