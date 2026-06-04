import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rekrutrek_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rekrutrek_token')
      localStorage.removeItem('rekrutrek_user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api

// --- PERBAIKAN DI SINI: Tambahkan /api di setiap path ---

export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login:    (data) => api.post('/api/auth/login', data),
  getMe:    ()     => api.get('/api/auth/me'),
}

export const profileService = {
  get:    ()     => api.get('/api/profile'),
  update: (data) => api.put('/api/profile', data),
}

export const jobService = {
  getAll:  (params) => api.get('/api/jobs', { params }),
  getById: (id)     => api.get(`/api/jobs/${id}`),
  getMy:   ()       => api.get('/api/jobs/my'),
  create:  (data)   => api.post('/api/jobs', data),
  delete:  (id)     => api.delete(`/api/jobs/${id}`),
}

export const applicationService = {
  apply:           (data)        => api.post('/api/applications', data),
  getMy:           ()            => api.get('/api/applications/my'),
  getForMyJobs:    ()            => api.get('/api/applications/my-jobs'),
  getByJob:        (id)          => api.get(`/api/applications/job/${id}`),
  updateStatus:    (id, status)  => api.put(`/api/applications/${id}/status`, { status }),
}

export const cvService = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('cv', file)
    return api.post('/api/cv/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })
  },
  getResult: () => api.get('/api/cv/result'),
}