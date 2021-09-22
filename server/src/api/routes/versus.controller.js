export const apiVersusInvalid = async (req, res) => {
  res.json({ message: 'Versus requires 2 IDs to compare' });
};

export const apiGetVersusResults = (db) => async (req, res) => {
  try {
    const versusResults = await db.getVersusResults(
      req.params.p1Id,
      req.params.p2Id
    );
    res.json(versusResults);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
