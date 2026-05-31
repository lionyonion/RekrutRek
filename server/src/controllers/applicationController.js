const { query }    = require('../config/db')
const aiService    = require('../services/aiService')
const haversineKm  = require('../utils/haversine')
const getRealDistanceKm = require('../utils/pathfinder') // TAMBAHKAN BARIS INI

// ── POST /api/applications ────────────────────────────────
exports.apply = async (req, res, next) => {
  try {
    const { job_id } = req.body
    const applicant_id = req.user.id

    // Ambil data job & profil pelamar secara paralel
    const [jobRes, profileRes] = await Promise.all([
      query('SELECT * FROM jobs WHERE id = $1 AND is_open = true', [job_id]),
      query('SELECT * FROM jobseeker_profiles WHERE user_id = $1', [applicant_id]),
    ])

    if (!jobRes.rows.length)
      return res.status(404).json({ error: 'Lowongan tidak ditemukan atau sudah tutup' })

    const job     = jobRes.rows[0]
    const profile = profileRes.rows[0]

   // Hitung jarak tempat tinggal (menggunakan rute jalan raya OSRM)
    let distance_km = null
    if (profile?.latitude && job.latitude) {
      distance_km = await getRealDistanceKm(profile.latitude, profile.longitude, job.latitude, job.longitude)
    }

    // Panggil AI service untuk skor kecocokan
    let match_score = null
    let score_detail = null
    try {
      const aiResult = await aiService.getMatchScore(
        {
          salary_expect: profile?.salary_expect,
          availability:  profile?.availability,
          distance_km,
          cv_features:   profile?.cv_extracted, // hasil ekstraksi CV
        },
        {
          salary_min:     job.salary_min,
          salary_max:     job.salary_max,
          job_type:       job.job_type,
          max_distance_km: job.max_distance_km,
        }
      )
      match_score  = aiResult.match_score
      score_detail = aiResult.score_detail
    } catch {
      // Fallback: AI service tidak tersedia, simpan lamaran tanpa skor
      console.warn('⚠️  AI service tidak tersedia — lamaran disimpan tanpa skor')
    }

    const { rows } = await query(
      `INSERT INTO applications
         (job_id, applicant_id, match_score, score_detail, distance_km)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [job_id, applicant_id, match_score, JSON.stringify(score_detail), distance_km]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Anda sudah melamar lowongan ini' })
    next(err)
  }
}

// ── GET /api/applications/my ──────────────────────────────
exports.getMyApplications = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*, j.title, j.address, j.salary_min, j.salary_max,
              j.job_type
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.applicant_id = $1
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// ── GET /api/applications/job/:id ─────────────────────────
// Untuk UMKM/Korporat melihat semua pelamar, diurutkan skor
exports.getApplicantsByJob = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*,
              u.email,
              jp.full_name, jp.phone, jp.cv_url, jp.cv_extracted,
              jp.salary_expect, jp.availability
       FROM applications a
       JOIN users u ON a.applicant_id = u.id
       LEFT JOIN jobseeker_profiles jp ON a.applicant_id = jp.user_id
       JOIN jobs j ON a.job_id = j.id
       WHERE a.job_id = $1 AND j.poster_id = $2
       ORDER BY a.match_score DESC NULLS LAST`,
      [req.params.id, req.user.id]
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// ── PUT /api/applications/:id/status ─────────────────────
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected']
    if (!validStatuses.includes(status))
      return res.status(400).json({ error: `Status tidak valid: ${validStatuses.join(', ')}` })

    const { rows, rowCount } = await query(
      `UPDATE applications a
       SET status = $1
       FROM jobs j
       WHERE a.id = $2 AND a.job_id = j.id AND j.poster_id = $3
       RETURNING a.*`,
      [status, req.params.id, req.user.id]
    )
    if (!rowCount)
      return res.status(404).json({ error: 'Lamaran tidak ditemukan' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}
