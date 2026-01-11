import getPool from './db.js';
import bcrypt from 'bcryptjs';


const pool = getPool();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    return res.status(200).json({
      message: 'Login success',
      token: 'dummy-token-secure'
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

console.log('DB HOST:', process.env.DB_HOST);
console.log('DB NAME:', process.env.DB_NAME);
console.log('USERNAME INPUT:', username);
console.log('PASSWORD INPUT:', password);
console.log('HASH DB:', admin.password);
console.log(
  'COMPARE RESULT:',
  await bcrypt.compare(password, admin.password)
);

