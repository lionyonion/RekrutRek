import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(form.email, form.password)
      if (user.user_type === 'jobseeker')  navigate('/dashboard')
      else if (user.user_type === 'umkm')  navigate('/umkm/dashboard')
      else navigate('/corporate/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-xl font-medium text-center mb-6">Masuk ke Rekrutrek</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-neutral-600 block mb-1">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="email@kamu.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600 block mb-1">Password</label>
          <input
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
      <p className="text-sm text-center text-neutral-500 mt-5">
        Belum punya akun?{' '}
        <Link to="/register" className="text-primary-400 hover:underline">Daftar di sini</Link>
      </p>
    </>
  )
}