export const apiGetNews = (db) => async (req, res) => {
  try {
    const news = await db.getNews();
    res.json(news);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
export const apiGetNewsById = (db) => async (req, res) => {
  try {
    const news = await db.getNewsById(req.params.id);
    res.json(news);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
};
