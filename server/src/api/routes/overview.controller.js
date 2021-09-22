export const apiOverviewByPlayerId = (db) => async (req, res) => {
  try {
    const overview = await db.getOverviewByPlayerId(req.params.playerId);
    res.json(overview);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
