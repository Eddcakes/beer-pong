/* typescript would make using db a lot nicer */
export const apiGetGames = (db) => async (req, res) => {
  try {
    const games = await db.getGames();
    res.json(games);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiGetGameById = (db) => async (req, res) => {
  try {
    const games = await db.getGameById(req.params.id);
    res.json(games);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
export const apiGetTournamentGamesById = (db) => async (req, res) => {
  try {
    const games = await db.getTournamentGamesById(req.params.id);
    res.json(games);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
export const apiGetRecentGamesByPlayerId = (db) => async (req, res) => {
  try {
    const games = await db.getRecentGamesByPlayerId(req.params.id);
    res.json(games);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiPostNewGame = (db) => async (req, res, next) => {
  try {
    const values = [
      req.body.player1,
      req.body.player2,
      req.body.homeCupsLeft,
      req.body.awayCupsLeft,
      req.body.venue,
      false,
      req.session.user.id,
      req.session.user.id,
      req.body.table,
      req.body.locked,
    ];
    const createNewGame = await db.postNewGame(values);
    if (createNewGame) {
      res.json({ message: 'New game created!', id: createNewGame.rows[0].id });
    } else {
      const error = new Error('Could not create game');
      next(error);
    }
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiPatchGame = (db) => async (req, res, next) => {
  try {
    const updateGame = await db.patchGame(
      req.body.homeCupsLeft,
      req.body.awayCupsLeft,
      req.body.table,
      req.params.id
    );
    if (updateGame) {
      res.json({
        message: 'game updated!',
      });
    } else {
      const error = new Error('Could not create game');
      next(error);
    }
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
