const { query }    = require('../config/db')
const aiService    = require('../services/aiService')
const haversineKm  = require('../utils/haversine')
const getRealDistanceKm = require('../utils/pathfinder') // TAMBAHKAN BARIS INI

exports.apply = async (req, res, next) => {
  try {
    const { job_id } = req.body
    const applicant_id = req.user.id

    const [jobRes, profileRes] = await Promise.all([
      query('SELECT * FROM jobs WHERE id = $1 AND is_open = true', [job_id]),
      query('SELECT * FROM jobseeker_profiles WHERE user_id = $1', [applicant_id]),
    ])

    if (!jobRes.rows.length)
      return res.status(404).json({ error: 'Lowongan tidak ditemukan atau sudah tutup' })

    const job     = jobRes.rows[0]
    const profile = profileRes.rows[0]

    let distance_km = null
    if (profile?.latitude && job.latitude) {
      distance_km = await getRealDistanceKm(profile.latitude, profile.longitude, job.latitude, job.longitude)
    }

    try {
      await aiService.syncCandidate({
        id: applicant_id,
        name: profile?.full_name,
        skills_description: profile?.bio || profile?.full_name || '',
        expected_salary: profile?.salary_expect,
      })
      await aiService.syncJob({
        id: job.id,
        title: job.title,
        description: [job.description, job.requirements].filter(Boolean).join('. '),
        max_budget: job.salary_max || job.salary_min || 0,
        employer_type: job.job_type === 'umkm' ? 'UMKM' : 'CORPORATE',
      })
    } catch (e) {
      console.warn('⚠️  AI sync saat apply gagal:', e.message)
    }

    const { rows } = await query(
      `INSERT INTO applications
         (job_id, applicant_id, distance_km)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [job_id, applicant_id, distance_km]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Anda sudah melamar lowongan ini' })
    next(err)
  }
}

exports.getMyApplications = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*, j.title, j.address, j.salary_min, j.salary_max, j.job_type,
              COALESCE(up.business_name, cp.company_name) AS poster_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       LEFT JOIN umkm_profiles up ON j.poster_id = up.user_id
       LEFT JOIN corporate_profiles cp ON j.poster_id = cp.user_id
       WHERE a.applicant_id = $1
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

exports.getApplicantsForMyJobs = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT a.*,
              u.email,
              jp.full_name, jp.phone, jp.cv_url, jp.salary_expect, jp.availability,
              j.title AS job_title, j.job_type
       FROM applications a
       JOIN users u ON a.applicant_id = u.id
       LEFT JOIN jobseeker_profiles jp ON a.applicant_id = jp.user_id
       JOIN jobs j ON a.job_id = j.id
       WHERE j.poster_id = $1
       ORDER BY a.match_score DESC NULLS LAST`,
      [req.user.id]
    )

    const ranked = await applyAiRanking(rows)
    res.json(ranked)
  } catch (err) {
    next(err)
  }
}

// Helper: overlay skor AI ke daftar pelamar, dikelompokkan per job_id
async function applyAiRanking(rows) {
  if (!rows.length) return rows

  // Kelompokkan applicant_id per job
  const byJob = {}
  rows.forEach((r) => {
    byJob[r.job_id] = byJob[r.job_id] || []
    byJob[r.job_id].push(r.applicant_id)
  })

  // Panggil AI rank per job (best-effort, paralel)
  const scoreMap = {} // `${job_id}|${candidate_id}` -> final_score 0..1
  await Promise.all(
    Object.entries(byJob).map(async ([jobId, ids]) => {
      try {
        const result = await aiService.rankAppliedCandidates(jobId, ids)
        ;(result.rankings || []).forEach((r) => {
          scoreMap[`${jobId}|${r.candidate_id}`] = r.final_score
        })
      } catch (e) {
        console.warn(`AI rank job ${jobId} gagal:`, e.message)
      }
    })
  )

  // Gabungkan: kalau ada skor AI, override match_score (skala 0-100)
  const enriched = rows.map((r) => {
    const ai = scoreMap[`${r.job_id}|${r.applicant_id}`]
    return ai != null
      ? { ...r, match_score: Math.round(ai * 100), ai_ranked: true }
      : r
  })

  // Urutkan ulang berdasarkan match_score tertinggi
  enriched.sort((a, b) => (b.match_score ?? -1) - (a.match_score ?? -1))
  return enriched
}

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

    const ranked = await applyAiRanking(rows)
    res.json(ranked)
  } catch (err) {
    next(err)
  }
}

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
