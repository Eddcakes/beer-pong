import { Router } from 'express';
import { validPlayerId } from '../../middlewares.js';
import {
  apiGetNicknames,
  apiGetNicknameOfPlayerId,
} from './nicknames.controller.js';

export const nicknamesRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetNicknames(db));
  router.get(
    '/player/:playerId',
    validPlayerId('Invalid player Id'),
    apiGetNicknameOfPlayerId(db)
  );
  return router;
};
