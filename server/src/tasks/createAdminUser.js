import bcrypt from 'bcryptjs';
import { poolPromise } from '../db.js';

const selectAdmin = `SELECT id, username, player_ID, active FROM ${process.env.DATABASE}.users WHERE role = 'admin'`;
const insertUser = `INSERT INTO ${process.env.DATABASE}.users (username, password, role, active) VALUES ($1, $2, $3, $4)`;

export async function createAdminUser() {
  const client = await poolPromise.connect();
  try {
    const adminAlreadyExists = await client.query(selectAdmin);
    if (adminAlreadyExists.rowCount > 0) {
      console.log('An admin user already exists!');
    } else {
      const adminHashedPass = await bcrypt.hash(process.env.ADMIN_DEFAULT, 12);
      const insertDefaultAdmin = await client.query(insertUser, [
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
    client.release();
    process.exit();
  }
}

createAdminUser();
