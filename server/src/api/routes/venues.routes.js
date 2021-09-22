import { Router } from 'express';
import { apiGetAllVenues } from './venues.controller.js';

export const venuesRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetAllVenues(db));
  return router;
};
