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
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
}

export const profileService = {
  get:    ()     => api.get('/profile'),
  update: (data) => api.put('/profile', data),
}

export const jobService = {
  getAll:  (params) => api.get('/jobs', { params }),
  getById: (id)     => api.get(`/jobs/${id}`),
  getMy:   ()       => api.get('/jobs/my'),
  create:  (data)   => api.post('/jobs', data),
  delete:  (id)     => api.delete(`/jobs/${id}`),
}

export const applicationService = {
  apply:           (data)        => api.post('/applications', data),
  getMy:           ()            => api.get('/applications/my'),
  getForMyJobs:    ()            => api.get('/applications/my-jobs'),
  getByJob:        (id)          => api.get(`/applications/job/${id}`),
  updateStatus:    (id, status)  => api.put(`/applications/${id}/status`, { status }),
}

export const cvService = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('cv', file)
    return api.post('/cv/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })
  },
  getResult: () => api.get('/cv/result'),
}
