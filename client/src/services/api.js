import axios from 'axios'

// ── Axios instance utama ──────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 detik — toleransi untuk panggilan ke AI service
})

// ── Request interceptor: sisipkan JWT otomatis ─────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rekrutrek_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: tangani expired token ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token kedaluwarsa → bersihkan storage, redirect ke login
      localStorage.removeItem('rekrutrek_token')
      localStorage.removeItem('rekrutrek_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api


// ============================================================
// SERVICE FUNCTIONS — gunakan di hooks atau komponen
// ============================================================

// ── Auth ─────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
}

// ── Profil ───────────────────────────────────────────────
export const profileService = {
  get:    ()     => api.get('/profile'),
  update: (data) => api.put('/profile', data),
}

// ── Lowongan ─────────────────────────────────────────────
export const jobService = {
  getAll:  (params) => api.get('/jobs', { params }),       // params: {type, lat, lng, max_km}
  getById: (id)     => api.get(`/jobs/${id}`),
  create:  (data)   => api.post('/jobs', data),
  delete:  (id)     => api.delete(`/jobs/${id}`),
}

// ── Lamaran ──────────────────────────────────────────────
export const applicationService = {
  apply:          (data) => api.post('/applications', data),
  getMy:          ()     => api.get('/applications/my'),
  getByJob:       (id)   => api.get(`/applications/job/${id}`),
  updateStatus:   (id, status) => api.put(`/applications/${id}/status`, { status }),
}

// ── CV ───────────────────────────────────────────────────
export const cvService = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('cv', file)
    return api.post('/cv/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // upload + ekstraksi LLM bisa lama
    })
  },
  getResult: () => api.get('/cv/result'),
}
