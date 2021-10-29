export const apiGetUserPreferences = (db) => async (req, res) => {
  try {
    const userPreferences = await db.getUserPreferences(req.session.user.id);
    res.json(userPreferences);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};

export const apiPostUserPreferences = (db) => async (req, res) => {
  try {
    const userPreferences = await db.postUserPreferences(
      req.session.user.id,
      req.body.avatar_link
    );
    /* depending on userPreferences response, can i tell if it was new created or updated? */
    /*
      res.json({ message: 'Preferences updated' });
      res.json({ message: 'Preferences created' });
    */
    res.json(userPreferences);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
