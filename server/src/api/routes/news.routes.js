import { Router } from 'express';
import { apiGetNews, apiGetNewsById } from './news.controller.js';

export const newsRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetNews(db));
  router.get('/:id', apiGetNewsById(db));
  return router;
};
