import getPool from './db.js';
import bcrypt from 'bcryptjs';

const pool = getPool();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('RAW BODY:', req.body);

  const { username, password } = req.body || {};

  console.log('USERNAME:', username);
  console.log('PASSWORD:', password);

  try {
    const [rows] = await pool.query(
      'SELECT * FROM admin'
    );

    console.log('ALL ADMIN:', rows);

    if (rows.length === 0) {
      return res.status(500).json({ error: 'Tabel admin kosong' });
    }

    const admin = rows.find(a => a.username === username);

    console.log('ADMIN FOUND:', admin);

    if (!admin) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(
      String(password).trim(),
      admin.password
    );

    console.log('COMPARE RESULT:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    return res.status(200).json({ message: 'Login success' });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
