const pool = require('./db');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
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
};
