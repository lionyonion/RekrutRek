import { useState, useEffect, createContext, useContext } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('rekrutrek_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('rekrutrek_token')
    if (!token) { setLoading(false); return }

    authService.getMe()
      .then(({ data }) => {
        setUser(data)
        // Sync localStorage dengan data terbaru dari server
        localStorage.setItem('rekrutrek_user', JSON.stringify(data))
      })
      .catch((err) => {
        // ✅ FIX: Hanya logout kalau token benar-benar invalid (401)
        // Kalau network error / server down (500, timeout, dsb),
        // tetap pakai user dari localStorage yang sudah di-load di atas
        if (err.response?.status === 401) {
          logout()
        }
        // Untuk error lain: diam saja, user tetap terautentikasi dari localStorage
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password })
    localStorage.setItem('rekrutrek_token', data.token)
    localStorage.setItem('rekrutrek_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (email, password, user_type, extraData = {}) => {
    const payload = {
      email,
      password,
      user_type,
      ...extraData
    }

    const { data } = await authService.register(payload)
    localStorage.setItem('rekrutrek_token', data.token)
    localStorage.setItem('rekrutrek_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('rekrutrek_token')
    localStorage.removeItem('rekrutrek_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
