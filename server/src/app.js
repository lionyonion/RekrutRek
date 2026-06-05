const express = require('express')
const cors    = require('cors')

// ── Routes ───────────────────────────────────────────────
const authRoutes        = require('./routes/authRoutes')
const profileRoutes     = require('./routes/profileRoutes')
const jobRoutes         = require('./routes/jobRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const cvRoutes          = require('./routes/cvRoutes')

const app = express()

// ── CORS ─────────────────────────────────────────────────
const allowedOrigins = [
  'https://rekrutrek.onrender.com',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Body parsers ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth',         authRoutes)
app.use('/api/profile',      profileRoutes)
app.use('/api/jobs',         jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/cv',           cvRoutes)

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date() })
)

// ── 404 handler ───────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ error: 'Endpoint tidak ditemukan' })
)

app.use((err, _req, res, _next) => {
  console.error('🔥 Unhandled error:', err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

module.exports = app