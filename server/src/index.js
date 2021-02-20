import express from 'express';
import morgan from 'morgan'; //logger
import cors from 'cors';
import session from 'express-session';

import { notFound, errorHandler } from './middlewares.js';
import { api } from './api/index.js';
// do i want to use helmet?
// do i want to use knex?

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(morgan('common'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: Number(process.env.SESSION_MAX_AGE),
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
  console.log(`listening at http://localhost:${port}`);
});
