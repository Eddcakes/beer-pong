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
