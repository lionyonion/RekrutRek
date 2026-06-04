const router = require('express').Router();
const { query } = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

const PROFILE_TABLES = {
  jobseeker: 'jobseeker_profiles',
  umkm: 'umkm_profiles',
  corporate: 'corporate_profiles',
};

// GET /api/profile
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const userType = req.user.user_type?.toLowerCase();
    const table = PROFILE_TABLES[userType];

    if (!table) return res.status(400).json({ error: "Tipe user tidak valid" });

    const { rows } = await query(
      `SELECT * FROM ${table} WHERE user_id = $1`,
      [req.user.id]
    );

    if (rows[0]) {
      // Map kembali full_name ke nama untuk kebutuhan frontend
      if (rows[0].full_name) {
        rows[0].nama = rows[0].full_name;
        delete rows[0].full_name;
      }
    }

    res.json(rows[0] || null);
  } catch (err) {
    next(err);
  }
});

// PUT /api/profile
router.put('/', authMiddleware, async (req, res, next) => {
  try {
    const userType = req.user.user_type?.toLowerCase();
    const table = PROFILE_TABLES[userType];

    if (!table) return res.status(400).json({ error: "Tipe user tidak valid" });

    // HAPUS email karena tidak ada di tabel profil
    const fields = { ...req.body };
    delete fields.email;

    // Mapping 'nama' dari frontend ke 'full_name' di database (Supabase)
    if (fields.nama) {
      fields.full_name = fields.nama;
      delete fields.nama;
    }

    // Jika setelah dihapus ternyata kosong, batalkan operasi
    const keys = Object.keys(fields);
    if (keys.length === 0) {
      return res.status(400).json({ error: "Tidak ada data valid yang bisa disimpan." });
    }

    const values = Object.values(fields);
    const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');

    const { rows } = await query(
      `INSERT INTO ${table} (user_id, ${keys.join(', ')})
       VALUES ($1, ${keys.map((_, i) => `$${i + 2}`).join(', ')})
       ON CONFLICT (user_id)
       DO UPDATE SET ${sets}, updated_at = now()
       RETURNING *`,
      [req.user.id, ...values]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;