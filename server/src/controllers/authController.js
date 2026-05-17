const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const { query } = require('../config/db')

const signToken = (user) =>
  jwt.sign(
    { id: user.id, user_type: user.user_type, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

// ── POST /api/auth/register ───────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { email, password, user_type } = req.body

    // Validasi dasar
    if (!email || !password || !user_type)
      return res.status(400).json({ error: 'email, password, dan user_type wajib diisi' })

    const validTypes = ['jobseeker', 'umkm', 'corporate']
    if (!validTypes.includes(user_type))
      return res.status(400).json({ error: `user_type harus salah satu dari: ${validTypes.join(', ')}` })

    const hash = await bcrypt.hash(password, 10)

    const { rows } = await query(
      `INSERT INTO users (email, password, user_type)
       VALUES ($1, $2, $3)
       RETURNING id, email, user_type, created_at`,
      [email.toLowerCase().trim(), hash, user_type]
    )

    const token = signToken(rows[0])
    res.status(201).json({ user: rows[0], token })
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Email sudah terdaftar' })
    next(err)
  }
}

// ── POST /api/auth/login ──────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'email dan password wajib diisi' })

    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )

    if (!rows.length || !(await bcrypt.compare(password, rows[0].password)))
      return res.status(401).json({ error: 'Email atau password salah' })

    const { password: _pwd, ...user } = rows[0]
    const token = signToken(user)
    res.json({ user, token })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/auth/me ──────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, email, user_type, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    if (!rows.length)
      return res.status(404).json({ error: 'User tidak ditemukan' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}
