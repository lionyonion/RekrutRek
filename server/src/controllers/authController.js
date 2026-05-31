const { query } = require('../config/db')
const { createClient } = require('@supabase/supabase-js')

// Inisialisasi klien Supabase menggunakan variabel dari .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// ── POST /api/auth/register ───────────────────────────────
exports.register = async (req, res, next) => {
  try {
    // Menangkap data dari form dinamis React yang baru kita buat
    const { email, password, user_type, pic_name, company_name, whatsapp } = req.body

    // Validasi dasar
    if (!email || !password || !user_type)
      return res.status(400).json({ error: 'email, password, dan user_type wajib diisi' })

    const validTypes = ['jobseeker', 'umkm', 'corporate']
    if (!validTypes.includes(user_type))
      return res.status(400).json({ error: `user_type harus salah satu dari: ${validTypes.join(', ')}` })

    // LANGKAH 1: Daftarkan ke Supabase Auth (Agar masuk ke dashboard gembok)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password: password,
    })

    if (authError) {
      // Menangani error jika email sudah terdaftar di Supabase Auth
      if (authError.message.includes('already registered')) {
        return res.status(409).json({ error: 'Email sudah terdaftar' })
      }
      return res.status(400).json({ error: authError.message })
    }

    const userId = authData.user.id

    // LANGKAH 2: Simpan detail peran & data perusahaan ke tabel public.users
    const { rows } = await query(
      `INSERT INTO users (id, email, user_type, pic_name, company_name, whatsapp)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, user_type, pic_name, company_name, created_at`,
      [
        userId, 
        email.toLowerCase().trim(), 
        user_type, 
        pic_name || null, 
        company_name || null, 
        whatsapp || null
      ]
    )

    // Kembalikan response sukses berserta token asli dari Supabase
    res.status(201).json({ 
      user: rows[0], 
      token: authData.session?.access_token || null 
    })

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

    // 1. Verifikasi kecocokan password menggunakan Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password,
    })

    if (authError)
      return res.status(401).json({ error: 'Email atau password salah' })

    // 2. Ambil profil user dari database lokal public.users
    const { rows } = await query(
      'SELECT id, email, user_type, pic_name, company_name FROM users WHERE id = $1',
      [authData.user.id]
    )

    if (!rows.length) {
      return res.status(404).json({ error: 'Profil data tidak ditemukan di database' })
    }

    // Kirim profil dan token JWT asli buatan Supabase ke Frontend React
    res.json({ 
      user: rows[0], 
      token: authData.session.access_token 
    })

  } catch (err) {
    next(err)
  }
}

// ── GET /api/auth/me ──────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    // Middleware kamu (req.user) sekarang harus membaca JWT milik Supabase
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