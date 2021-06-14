import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const db_settings = {
  user: process.env.PGUSER,
  host: process.env.DB_HOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.DB_PORT),
};

export const poolPromise = new pg.Pool(db_settings);

poolPromise.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
