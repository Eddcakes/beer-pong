import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const env_settings = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: 5,
};

export const poolPromise = new mariadb.createPool(env_settings);
poolPromise
  .getConnection()
  .then((pool) => {
    console.log('connected to mariadb');
    return pool;
  })
  .catch((err) => console.log('db connection failed', err));
