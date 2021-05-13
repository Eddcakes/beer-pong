import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

const selectNewsAndUsers = `
SELECT news.news_ID,
news.content,
news.image_url,
news.priority,
news.approved,
news.created,
news.modified,
news.created_by,
p1.name as created_by_name,
news.modified_by,
p2.name as modified_by_name
FROM ${process.env.DATABASE}.news
LEFT JOIN players AS p1 ON news.created_by = p1.player_ID
LEFT JOIN players AS p2 ON news.modified_by = p2.player_ID
`;
const whereApproved = `WHERE news.approved = 1`;
const whereId = `WHERE news.news_ID = ?`;
// create admin page for approving news
const whereNotApproved = `WHERE news.approved = 0`;

router.get('/', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(`${selectNewsAndUsers} ${whereApproved}`);
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    const data = await pool.query(
      `${selectNewsAndUsers} ${whereId}`,
      req.params.id
    );
    return res.json(data);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});

export { router as news };
