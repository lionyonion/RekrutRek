const jwt = require('jsonwebtoken')

/**
 * Middleware verifikasi JWT.
 * Ambil token dari header: Authorization: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token tidak ditemukan' })

  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Token sudah kedaluwarsa, silakan login ulang'
      : 'Token tidak valid'
    res.status(401).json({ error: msg })
  }
}

/**
 * Middleware role-based access.
 * Contoh pemakaian: requireRole('umkm', 'corporate')
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.user_type))
    return res.status(403).json({
      error: `Akses ditolak. Hanya untuk: ${roles.join(', ')}`,
    })
  next()
}

module.exports = { authMiddleware, requireRole }
