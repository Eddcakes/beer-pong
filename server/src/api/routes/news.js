import express from 'express';
import { poolPromise } from '../../db.js';

const router = express.Router();

/* group by priority? */

const selectNewsAndUsers = `
SELECT news.id,
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
LEFT JOIN players AS p1 ON news.created_by = p1.id
LEFT JOIN players AS p2 ON news.modified_by = p2.id
`;
const whereApproved = `WHERE news.approved = true`;
const whereId = `WHERE news.id = $1`;
const orderByDesc = `ORDER BY news.id DESC`;
// create admin page for approving news
const whereNotApproved = `WHERE news.approved = true`;

router.get('/', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(
      `${selectNewsAndUsers} ${whereApproved} ${orderByDesc}`
    );
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

router.get('/:id', async (req, res) => {
  const client = await poolPromise.connect();
  try {
    const data = await client.query(`${selectNewsAndUsers} ${whereId}`, [
      req.params.id,
    ]);
    return res.json(data.rows);
  } catch (err) {
    res.status(500);
    res.send(err.message);
  } finally {
    client.release();
  }
});

export { router as news };
