const pool = require('./db');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Cari admin di database berdasarkan username
      const [rows] = await pool.query('SELECT * FROM admin WHERE username = ?', [username]);
      
      if (rows.length > 0) {
        const admin = rows[0];
        
        // Bandingkan password (Plain text untuk demo sederhana)
        // Di production sebaiknya pakai bcrypt untuk enkripsi
        if (password === admin.password) {
            return res.status(200).json({ message: 'Login success', token: 'dummy-token-secure' });
        }
      }
      
      // Jika user tidak ada atau password salah
      res.status(401).json({ error: 'Username atau password salah' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};