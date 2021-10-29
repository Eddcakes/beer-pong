export const apiGetTournaments = (db) => async (req, res) => {
  try {
    const tournaments = await db.getTournaments();
    res.json(tournaments);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiGetRecentTournaments = (db) => async (req, res) => {
  try {
    const recentTournaments = await db.getRecentTournaments();
    res.json(recentTournaments);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
export const apiGetTournamentById = (db) => async (req, res) => {
  try {
    const tournament = await db.getTournamentById(req.params.id);
    res.json(tournament);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
