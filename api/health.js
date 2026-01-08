const pool = require('./db');

module.exports = async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', db: 'connected' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
