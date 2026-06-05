const router          = require('express').Router();
const { query }       = require('../config/db');
const { authMiddleware } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const uploadToStorage = require('../utils/storageUpload');

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

    // Kolom-kolom yang TIDAK boleh masuk ke tabel profil
    const EXCLUDED = ['email', 'user_id', 'id', 'created_at', 'updated_at', 'cv_url', 'cv_extracted']

    const fields = { ...req.body };

    // Hapus field yang tidak relevan atau dikelola endpoint lain
    EXCLUDED.forEach(k => delete fields[k])

    // Hapus nilai null/undefined agar tidak merusak kolom yang belum ada
    Object.keys(fields).forEach(k => {
      if (fields[k] === null || fields[k] === undefined || fields[k] === '') delete fields[k]
    })

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

// POST /api/profile/photo — Upload foto profil
router.post('/photo', authMiddleware, uploadImage.single('photo'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'File gambar wajib diupload' })
  try {
    const userType = req.user.user_type?.toLowerCase()
    const table = PROFILE_TABLES[userType]
    if (!table) return res.status(400).json({ error: 'Tipe user tidak valid' })

    // Upload buffer ke Supabase Storage bucket 'avatars'
    const photo_url = await uploadToStorage(
      'avatars',
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    )

    try {
      await query(
        `INSERT INTO ${table} (user_id, photo_url)
         VALUES ($1, $2)
         ON CONFLICT (user_id)
         DO UPDATE SET photo_url = $2, updated_at = now()`,
        [req.user.id, photo_url]
      )
    } catch (dbErr) {
      if (dbErr.message?.includes('column') && dbErr.message?.includes('photo_url')) {
        console.warn('⚠️  Kolom photo_url belum ada. Jalankan migrasi SQL.')
        return res.json({ photo_url, warning: 'Kolom photo_url belum ada di DB. Jalankan migrasi.' })
      }
      throw dbErr
    }
    res.json({ photo_url })
  } catch (err) {
    next(err)
  }
})

module.exports = router;