const router    = require('express').Router()
const { query } = require('../config/db')
const { authMiddleware } = require('../middleware/auth')

const PROFILE_TABLES = {
  jobseeker: 'jobseeker_profiles',
  umkm:      'umkm_profiles',
  corporate: 'corporate_profiles',
}

// GET /api/profile
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const table = PROFILE_TABLES[req.user.user_type]
    const { rows } = await query(
      `SELECT * FROM ${table} WHERE user_id = $1`,
      [req.user.id]
    )
    res.json(rows[0] || null)
  } catch (err) {
    next(err)
  }
})

// PUT /api/profile — upsert profil
router.put('/', authMiddleware, async (req, res, next) => {
  try {
    const { user_type, id: user_id } = req.user
    const table = PROFILE_TABLES[user_type]
    const fields = req.body

    // Bangun query upsert secara dinamis
    const keys   = Object.keys(fields)
    const values = Object.values(fields)
    const sets   = keys.map((k, i) => `${k} = $${i + 2}`).join(', ')

    const { rows } = await query(
      `INSERT INTO ${table} (user_id, ${keys.join(', ')})
       VALUES ($1, ${keys.map((_, i) => `$${i + 2}`).join(', ')})
       ON CONFLICT (user_id)
       DO UPDATE SET ${sets}, updated_at = now()
       RETURNING *`,
      [user_id, ...values]
    )
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
})

module.exports = router
