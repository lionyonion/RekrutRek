const { query } = require('../config/db')
const { createClient } = require('@supabase/supabase-js')
const jwt = require('jsonwebtoken')

// Inisialisasi klien Supabase menggunakan variabel dari .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// Helper: buat JWT sendiri (bukan pakai token Supabase)
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, user_type: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

// ── POST /api/auth/register ───────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { email, password, user_type, pic_name, company_name, whatsapp } = req.body

    if (!email || !password || !user_type)
      return res.status(400).json({ error: 'email, password, dan user_type wajib diisi' })

    const validTypes = ['jobseeker', 'umkm', 'corporate']
    if (!validTypes.includes(user_type))
      return res.status(400).json({ error: `user_type harus salah satu dari: ${validTypes.join(', ')}` })

    // LANGKAH 1: Daftarkan ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password: password,
    })

    if (authError) {
      if (authError.message.includes('already registered'))
        return res.status(409).json({ error: 'Email sudah terdaftar' })
      return res.status(400).json({ error: authError.message })
    }

    const userId = authData.user.id

    // LANGKAH 2: Simpan ke tabel public.users
    const { rows } = await query(
      `INSERT INTO users (id, email, user_type, pic_name, company_name, whatsapp)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, user_type, pic_name, company_name, created_at`,
      [userId, email.toLowerCase().trim(), user_type, pic_name || null, company_name || null, whatsapp || null]
    )

    // ✅ FIX: Kirim JWT buatan sendiri, bukan token Supabase
    const token = signToken(rows[0])
    res.status(201).json({ user: rows[0], token })

  } catch (err) {
    next(err)
  }
}

// ── POST /api/auth/login ──────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'email dan password wajib diisi' })

    // LANGKAH 1: Verifikasi password via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password,
    })

    if (authError)
      return res.status(401).json({ error: 'Email atau password salah' })

    // LANGKAH 2: Ambil profil dari public.users
    const { rows } = await query(
      'SELECT id, email, user_type, pic_name, company_name FROM users WHERE id = $1',
      [authData.user.id]
    )

    if (!rows.length)
      return res.status(404).json({ error: 'Profil data tidak ditemukan di database' })

    // ✅ FIX: Kirim JWT buatan sendiri, bukan token Supabase
    const token = signToken(rows[0])
    res.json({ user: rows[0], token })

  } catch (err) {
    next(err)
  }
}

// ── GET /api/auth/me ──────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    // req.user diisi oleh auth.js middleware — sudah pakai JWT_SECRET, tidak perlu diubah
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