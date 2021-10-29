export const apiGetAllVenues = (db) => async (req, res) => {
  try {
    const allVenues = await db.getAllVenues();
    res.json(allVenues);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
