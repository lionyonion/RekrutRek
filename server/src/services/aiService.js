const fetch    = require('node-fetch')
const FormData = require('form-data')
const fs       = require('fs')

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

/**
 * Kirim file PDF ke FastAPI → return JSON hasil ekstraksi AI
 * @param {string} filePath  - path file PDF di server
 * @returns {Object} { name, skills, education, experience, ... }
 */
exports.extractCV = async (filePath) => {
  const form = new FormData()
  form.append('file', fs.createReadStream(filePath), {
    filename:    'cv.pdf',
    contentType: 'application/pdf',
  })

  const res = await fetch(`${AI_URL}/extract-cv`, {
    method:  'POST',
    body:    form,
    headers: form.getHeaders(),
    timeout: 30000, // LLM bisa lambat — tunggu 30 detik
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`AI extract-cv gagal (${res.status}): ${errText}`)
  }
  return res.json()
}

/**
 * Kirim data tabular ke FastAPI → return skor kecocokan
 * @param {Object} applicantData - profil + fitur pelamar
 * @param {Object} jobData       - data lowongan
 * @returns {{ match_score: number, score_detail: Object }}
 */
exports.getMatchScore = async (applicantData, jobData) => {
  const res = await fetch(`${AI_URL}/match-score`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ applicant: applicantData, job: jobData }),
    timeout: 15000,
  })

  if (!res.ok) {
    // Fallback ringan — jangan crash aplikasi jika AI tidak responsif
    console.warn(`⚠️  AI match-score error (${res.status}) — menggunakan fallback`)
    return {
      match_score:  null,
      score_detail: { fallback: true, reason: 'AI service tidak tersedia' },
    }
  }

  return res.json()
  // Ekspektasi response dari FastAPI:
  // { match_score: 87.3, score_detail: { salary: 90, distance: 85, availability: 88 } }
}
