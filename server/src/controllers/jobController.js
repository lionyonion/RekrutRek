const { query } = require('../config/db')
const haversineKm = require('../utils/haversine')

// ── GET /api/jobs ─────────────────────────────────────────
exports.getJobs = async (req, res, next) => {
  try {
    const { type, lat, lng, max_km = 50, page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit
    const conditions = ['j.is_open = true']
    const params = []

    if (type) {
      params.push(type)
      conditions.push(`j.job_type = $${params.length}`)
    }

    const where = conditions.join(' AND ')

    const { rows } = await query(
      `SELECT j.*, 
              COALESCE(up.business_name, cp.company_name) AS poster_name
       FROM jobs j
       LEFT JOIN umkm_profiles up ON j.poster_id = up.user_id
       LEFT JOIN corporate_profiles cp ON j.poster_id = cp.user_id
       WHERE ${where}
       ORDER BY j.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    )

    // Filter jarak di sisi JS jika ada koordinat user
    let jobs = rows
    if (lat && lng) {
      jobs = rows.filter(j => {
        if (!j.latitude || !j.longitude) return true
        const d = haversineKm(
          parseFloat(lat), parseFloat(lng),
          parseFloat(j.latitude), parseFloat(j.longitude)
        )
        j.distance_km = Math.round(d * 10) / 10
        return d <= parseFloat(max_km)
      })
    }

    res.json({ jobs, page: +page, limit: +limit })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/jobs/:id ─────────────────────────────────────
exports.getJobById = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT j.*,
              COALESCE(up.business_name, cp.company_name) AS poster_name,
              COALESCE(up.address, cp.address) AS poster_address
       FROM jobs j
       LEFT JOIN umkm_profiles up ON j.poster_id = up.user_id
       LEFT JOIN corporate_profiles cp ON j.poster_id = cp.user_id
       WHERE j.id = $1`,
      [req.params.id]
    )
    if (!rows.length)
      return res.status(404).json({ error: 'Lowongan tidak ditemukan' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// ── POST /api/jobs ────────────────────────────────────────
exports.createJob = async (req, res, next) => {
  try {
    const {
      title, description, requirements,
      salary_min, salary_max,
      latitude, longitude, address,
      max_distance_km,
    } = req.body

    const job_type = req.user.user_type === 'umkm' ? 'umkm' : 'corporate'

    const { rows } = await query(
      `INSERT INTO jobs
         (poster_id, title, description, requirements, job_type,
          salary_min, salary_max, latitude, longitude, address, max_distance_km)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [req.user.id, title, description, requirements, job_type,
       salary_min, salary_max, latitude, longitude, address, max_distance_km]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
}

// ── GET /api/jobs/my ──────────────────────────────────────
exports.getMyJobs = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT j.*, COUNT(a.id)::int AS applicant_count
       FROM jobs j
       LEFT JOIN applications a ON j.id = a.job_id
       WHERE j.poster_id = $1
       GROUP BY j.id
       ORDER BY j.created_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// ── DELETE /api/jobs/:id ──────────────────────────────────
exports.deleteJob = async (req, res, next) => {
  try {
    const { rowCount } = await query(
      'DELETE FROM jobs WHERE id = $1 AND poster_id = $2',
      [req.params.id, req.user.id]
    )
    if (!rowCount)
      return res.status(404).json({ error: 'Lowongan tidak ditemukan atau bukan milik Anda' })
    res.json({ message: 'Lowongan berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}
