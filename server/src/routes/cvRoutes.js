const router          = require('express').Router()
const { upload }      = require('../middleware/upload')
const { query }       = require('../config/db')
const aiService       = require('../services/aiService')
const uploadToStorage = require('../utils/storageUpload')
const { authMiddleware, requireRole } = require('../middleware/auth')

// POST /api/cv/upload — Upload PDF ke Supabase Storage, ekstraksi AI, simpan ke profil
router.post(
  '/upload',
  authMiddleware,
  requireRole('jobseeker'),
  upload.single('cv'),
  async (req, res, next) => {
    if (!req.file)
      return res.status(400).json({ error: 'File PDF wajib diupload' })
    try {
      // Upload buffer ke Supabase Storage bucket 'cvs'
      const cv_url = await uploadToStorage(
        'cvs',
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      )

      // Kirim buffer ke AI service untuk ekstraksi
      let extracted = null
      try {
        extracted = await aiService.extractCV(req.file.buffer, req.file.originalname)
      } catch (aiErr) {
        console.warn('AI extractCV gagal:', aiErr.message)
      }

      // Simpan cv_url dan hasil ekstraksi ke profil
      await query(
        `UPDATE jobseeker_profiles
         SET cv_url = $1, cv_extracted = $2
         WHERE user_id = $3`,
        [cv_url, JSON.stringify(extracted), req.user.id]
      )

      res.json({ cv_url, extracted, ai_available: extracted !== null })
    } catch (err) {
      next(err)
    }
  }
)

// GET /api/cv/result — Ambil hasil ekstraksi tersimpan
router.get('/result', authMiddleware, async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT cv_url, cv_extracted FROM jobseeker_profiles WHERE user_id = $1',
      [req.user.id]
    )
    if (!rows.length)
      return res.status(404).json({ error: 'Profil tidak ditemukan' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

module.exports = router
