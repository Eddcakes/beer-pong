import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { notFound, errorHandler, checkTokenSetUser } from './middlewares.js';
import { api } from './api/index.js';
import { message } from './api/placeholder.js';
// do i want to use helmet?
// do i want to use knex?

const app = express();

app.use(morgan('common'));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.use(checkTokenSetUser);

app.get('/', (req, res) => {
  res.json({
    message: message,
    user: req.user,
  });
});

app.use('/api/v1', api);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 1337;

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
