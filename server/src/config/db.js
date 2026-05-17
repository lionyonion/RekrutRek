const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  // Connection pool settings
  max: 10,              // maksimum koneksi bersamaan
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test koneksi saat server pertama kali jalan
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Gagal konek ke PostgreSQL:', err.message)
    return
  }
  release()
  console.log('✅ PostgreSQL terhubung')
})

// Helper: query dengan error logging otomatis
const query = async (text, params) => {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Query (${duration}ms):`, text.slice(0, 80))
    }
    return result
  } catch (err) {
    console.error('❌ Query error:', err.message)
    throw err
  }
}

module.exports = { pool, query }
