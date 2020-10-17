import bcrypt from 'bcryptjs';
import { poolPromise } from '../db.js';

const selectAdmin = `SELECT user_ID, username, player_ID, active FROM ${process.env.DATABASE}.users WHERE role = 'admin'`;
const insertUser =
  'INSERT INTO users (username, password, role, active) VALUES (?, ?, ?, ?)';

export async function createAdminUser() {
  let pool;
  try {
    pool = await poolPromise;
    const adminAlreadyExists = await poolPromise.query(selectAdmin);
    if (adminAlreadyExists.length > 0) {
      console.log('An admin user already exists!');
    } else {
      const adminHashedPass = await bcrypt.hash(process.env.ADMIN_DEFAULT, 12);
      const insertDefaultAdmin = await poolPromise.query(insertUser, [
        'Admin',
        adminHashedPass,
        'admin',
        1,
      ]);
      if (insertDefaultAdmin) {
        console.log('successfully created default admin user');
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    // close program after running
    pool.end();
    process.exit();
  }
}

createAdminUser();
