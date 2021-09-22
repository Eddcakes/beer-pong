export const apiGetCurrentRecords = (db) => async (req, res) => {
  try {
    const currentRecords = await db.getCurrentRecords();
    res.json(currentRecords);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiGetAllRecords = (db) => async (req, res) => {
  try {
    const allRecords = await db.getAllRecords();
    res.json(allRecords);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiGetRecordsByPlayerId = (db) => async (req, res) => {
  try {
    const recordsByPlayer = await db.getRecordsByPlayerId(req.params.playerId);
    res.json(recordsByPlayer);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiGetRecordsByTypeId = (db) => async (req, res) => {
  try {
    const recordsByType = await db.getRecordsByTypeId(req.params.typeId);
    res.json(recordsByType);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
