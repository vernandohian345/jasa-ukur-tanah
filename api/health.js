import pool from './db';

export default async function handler(req, res) {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'DB CONNECTED' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
