import mysql from 'mysql2/promise';

let pool;

export default function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 5,
      enableKeepAlive: true
    });
  }
  return pool;
}
