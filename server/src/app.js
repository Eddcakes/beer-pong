import express from 'express';
import morgan from 'morgan'; //logger
import cors from 'cors';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import helmet from 'helmet';

import { notFound, errorHandler } from './middlewares.js';
import { api } from './api/index.js';
import { poolPromise } from './db.js';

const app = express();

const pgs = pgSession(session);

const cookiesSecure =
  process.env.NODE_ENV.trim().toLowerCase() === 'production';
app.set('trust proxy', 1);
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

app.use(notFound);
app.use(errorHandler);

export default app;
