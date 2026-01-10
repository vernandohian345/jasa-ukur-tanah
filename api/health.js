import getPool from './db.js';

export default async function handler(req, res) {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'DB CONNECTED' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
