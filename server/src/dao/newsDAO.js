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
LEFT JOIN ${process.env.DATABASE}.players AS p1 ON news.created_by = p1.id
LEFT JOIN ${process.env.DATABASE}.players AS p2 ON news.modified_by = p2.id
`;
const whereApproved = `WHERE news.approved = true`;
const whereId = `WHERE news.id = $1`;
const orderByDesc = `ORDER BY news.id DESC`;
// create admin page for approving news
const whereNotApproved = `WHERE news.approved = true`;

let client;
let poolRef;
export default class NewsDAO {
  static async injectDB(connection) {
    if (client) {
      return;
    }
    try {
      poolRef = connection;
      client = await poolRef.connect();
    } catch (err) {
      console.error(`Unable to connect to connection pool in NewsDAO: ${err}`);
    } finally {
      client.release();
    }
  }
  static async getNews() {
    try {
      client = await poolRef.connect();
      const news = await client.query(
        `${selectNewsAndUsers} ${whereApproved} ${orderByDesc}`
      );
      return news.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
  static async getNewsById(newsId) {
    try {
      client = await poolRef.connect();
      const newsById = await client.query(`${selectNewsAndUsers} ${whereId}`, [
        newsId,
      ]);
      return newsById.rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      client.release();
    }
  }
}
