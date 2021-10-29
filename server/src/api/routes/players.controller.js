export const apiGetPlayers = (db) => async (req, res) => {
  try {
    const players = await db.getPlayers();
    res.json(players);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiGetPlayerById = (db) => async (req, res) => {
  try {
    const player = await db.getPlayerById(req.params.id);
    res.json(player);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiPostNewPlayer = (db) => async (req, res, next) => {
  try {
    const createNewPlayer = await db.postNewPlayer(req.body.playerName);
    if (createNewPlayer) {
      res.json({
        message: 'New player created!',
        id: createNewPlayer.rows[0].id,
      });
    }
  } catch (err) {
    if (String(err).includes('username is taken')) {
      // if it is username taken error add the right status code
      res.status(409);
      next(err);
    }
  }
};
