import { Router } from 'express';
import {
  apiGetNicknames,
  apiGetNicknameOfPlayerId,
} from './nicknames.controller.js';

export const nicknamesRouter = (db) => {
  const router = new Router();
  router.get('/', apiGetNicknames(db));
  router.get('/player/:playerId', apiGetNicknameOfPlayerId(db));
  return router;
};
