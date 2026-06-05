const fetch = require('node-fetch')

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

async function postJSON(path, body, { timeout = 15000 } = {}) {
  const res = await fetch(`${AI_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    timeout,
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`AI ${path} gagal (${res.status}): ${txt}`)
  }
  return res.json()
}

/**
 * Sinkronkan profil pelamar ke AI engine (ChromaDB).
 * @param {{ id, name, skills_description, expected_salary }} data
 */
exports.syncCandidate = (data) =>
  postJSON('/api/v1/sync/candidate', {
    id: String(data.id),
    name: data.name || 'Tanpa Nama',
    skills_description: data.skills_description || '',
    expected_salary: parseInt(data.expected_salary) || 0,
  })

/**
 * Sinkronkan lowongan ke AI engine (ChromaDB).
 * @param {{ id, title, description, max_budget, employer_type }} data
 */
exports.syncJob = (data) =>
  postJSON('/api/v1/sync/job', {
    id: String(data.id),
    title: data.title || '',
    description: data.description || '',
    max_budget: parseInt(data.max_budget) || 0,
    employer_type: (data.employer_type || 'UMKM').toUpperCase(),
  })

/**
 * Rangking pelamar yang SUDAH melamar pada satu lowongan.
 * @param {string} jobId
 * @param {string[]} appliedCandidateIds
 * @returns {Promise<{ job_id, rankings: Array }>}
 **/
exports.rankAppliedCandidates = (jobId, appliedCandidateIds, opts = {}) =>
  postJSON('/api/v1/rank/applied-candidates', {
    job_id: String(jobId),
    applied_candidate_ids: appliedCandidateIds.map(String),
    weight_ai: opts.weight_ai ?? 0.7,
    weight_salary: opts.weight_salary ?? 0.3,
  })

exports.recommendJobs = (candidateId, opts = {}) =>
  postJSON('/api/v1/recommend/jobs', {
    target_id: String(candidateId),
    weight_ai: opts.weight_ai ?? 0.7,
    weight_salary: opts.weight_salary ?? 0.3,
    top_k: opts.top_k ?? 10,
  })
