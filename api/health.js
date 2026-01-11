// import getPool from './db.js';

// export default async function handler(req, res) {
//   try {
//     const pool = getPool();
//     const [rows] = await pool.query('SELECT 1 AS ok');
//     res.status(200).json({ status: 'DB CONNECTED', rows });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }
