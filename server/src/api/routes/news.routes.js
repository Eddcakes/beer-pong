import { Router } from 'express';
import { apiGetNews, apiGetNewsById } from './news.controller.js';
import { validId } from '../../middlewares.js';

export const newsRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetNews(db));
  router.get('/:id', validId('Not a valid news ID'), apiGetNewsById(db));
  return router;
};
