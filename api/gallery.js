const pool = require('./db');

module.exports = async (req, res) => {
  
  // 1. AMBIL DATA (GET)
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gagal mengambil data gallery' });
    }
  } 
  
  // 2. TAMBAH DATA BARU (POST)
  else if (req.method === 'POST') {
    try {
      const { judul, deskripsi, gambar } = req.body;
      
      if (!judul || !gambar) {
        return res.status(400).json({ error: 'Judul dan Gambar wajib diisi' });
      }

      // Simpan ke MySQL (Gambar disimpan sebagai teks Base64)
      await pool.query(
        'INSERT INTO gallery (judul, deskripsi, gambar) VALUES (?, ?, ?)', 
        [judul, deskripsi, gambar]
      );
      
      res.status(201).json({ message: 'Berhasil menambah gallery' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gagal menyimpan data ke database' });
    }
  }

  // 3. UPDATE DATA (PUT)
  else if (req.method === 'PUT') {
    try {
      const { id, judul, deskripsi, gambar } = req.body;
      
      if(!id) return res.status(400).json({ error: 'ID wajib ada' });

      // Query dinamis: Update gambar hanya jika ada input baru
      let query, params;
      if (gambar) {
        query = 'UPDATE gallery SET judul = ?, deskripsi = ?, gambar = ? WHERE id = ?';
        params = [judul, deskripsi, gambar, id];
      } else {
        query = 'UPDATE gallery SET judul = ?, deskripsi = ? WHERE id = ?';
        params = [judul, deskripsi, id];
      }

      await pool.query(query, params);
      res.status(200).json({ message: 'Berhasil update gallery' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gagal update data' });
    }
  }

  // 4. HAPUS DATA (DELETE)
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // Ambil id dari URL (?id=1)
      if(!id) return res.status(400).json({ error: 'ID wajib ada' });

      await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
      res.status(200).json({ message: 'Berhasil menghapus gallery' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gagal menghapus data' });
    }
  }
};