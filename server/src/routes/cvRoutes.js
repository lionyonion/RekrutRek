const router          = require('express').Router()
const { upload }      = require('../middleware/upload')
const { query }       = require('../config/db')
const aiService       = require('../services/aiService')
const uploadToStorage = require('../utils/storageUpload')
const { authMiddleware, requireRole } = require('../middleware/auth')

router.post(
  '/upload',
  authMiddleware,
  requireRole('jobseeker'),
  upload.single('cv'),
  async (req, res, next) => {
    if (!req.file)
      return res.status(400).json({ error: 'File PDF wajib diupload' })
    try {
     
      const cv_url = await uploadToStorage(
        'cvs',
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      )

    
      await query(
        `UPDATE jobseeker_profiles SET cv_url = $1 WHERE user_id = $2`,
        [cv_url, req.user.id]
      )

      let ai_synced = false
      try {
        const { rows } = await query(
          'SELECT full_name, bio, salary_expect FROM jobseeker_profiles WHERE user_id = $1',
          [req.user.id]
        )
        const p = rows[0] || {}
        await aiService.syncCandidate({
          id: req.user.id,
          name: p.full_name,
          skills_description: p.bio || p.full_name || '',
          expected_salary: p.salary_expect,
        })
        ai_synced = true
      } catch (aiErr) {
        console.warn('AI syncCandidate gagal:', aiErr.message)
      }

      res.json({ cv_url, ai_available: ai_synced })
    } catch (err) {
      next(err)
    }
  }
)

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
