const pool = require('./db');

module.exports = async (req, res) => {
  try {
    // GET
    if (req.method === 'GET') {
      const [rows] = await pool.query(
        'SELECT * FROM gallery ORDER BY created_at DESC'
      );
      return res.status(200).json(rows);
    }

    // POST
    if (req.method === 'POST') {
      const { judul, deskripsi, gambar } = req.body;

      if (!judul || !gambar) {
        return res.status(400).json({ error: 'Judul & gambar wajib diisi' });
      }

      await pool.query(
        'INSERT INTO gallery (judul, deskripsi, gambar) VALUES (?, ?, ?)',
        [judul, deskripsi, gambar]
      );

      return res.status(201).json({ message: 'Gallery ditambahkan' });
    }

    // PUT
    if (req.method === 'PUT') {
      const { id, judul, deskripsi, gambar } = req.body;
      if (!id) return res.status(400).json({ error: 'ID wajib ada' });

      const query = gambar
        ? 'UPDATE gallery SET judul=?, deskripsi=?, gambar=? WHERE id=?'
        : 'UPDATE gallery SET judul=?, deskripsi=? WHERE id=?';

      const params = gambar
        ? [judul, deskripsi, gambar, id]
        : [judul, deskripsi, id];

      await pool.query(query, params);
      return res.status(200).json({ message: 'Gallery diupdate' });
    }

    // DELETE
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID wajib ada' });

      await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
      return res.status(200).json({ message: 'Gallery dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
