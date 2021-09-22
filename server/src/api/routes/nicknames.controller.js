export const apiGetNicknames = (db) => async (req, res) => {
  try {
    const nicknames = await db.getNicknames();
    res.json(nicknames);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiGetNicknameOfPlayerId = (db) => async (req, res) => {
  try {
    const nicknames = await db.getNicknameOfPlayerId(req.params.id);
    res.json(nicknames);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
