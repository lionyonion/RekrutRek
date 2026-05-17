import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const USER_TYPES = [
  { value: 'jobseeker', label: 'Pencari Kerja',  desc: 'Saya sedang mencari pekerjaan' },
  { value: 'umkm',      label: 'Pemilik UMKM',   desc: 'Saya ingin merekrut karyawan UMKM' },
  { value: 'corporate', label: 'HRD Korporat',   desc: 'Saya merekrut untuk perusahaan besar' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '', user_type: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.user_type) { setError('Pilih tipe akun terlebih dahulu'); return }
    setLoading(true); setError('')
    try {
      const user = await register(form.email, form.password, form.user_type)
      if (user.user_type === 'jobseeker')  navigate('/dashboard')
      else if (user.user_type === 'umkm')  navigate('/umkm/dashboard')
      else navigate('/corporate/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Pendaftaran gagal, coba lagi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-xl font-medium text-center mb-6">Daftar Akun Baru</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-neutral-600 block mb-2">Saya adalah...</label>
          <div className="flex flex-col gap-2">
            {USER_TYPES.map(t => (
              <label key={t.value}
                className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors
                  ${form.user_type === t.value
                    ? 'border-primary-400 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'}`}>
                <input type="radio" name="user_type" value={t.value}
                  className="mt-0.5"
                  onChange={e => setForm({ ...form, user_type: e.target.value })} />
                <div>
                  <div className="text-sm font-medium text-neutral-800">{t.label}</div>
                  <div className="text-xs text-neutral-500">{t.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-neutral-600 block mb-1">Email</label>
          <input type="email" className="input-field" placeholder="email@kamu.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="text-sm text-neutral-600 block mb-1">Password</label>
          <input type="password" className="input-field" placeholder="Minimal 8 karakter"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            minLength={6} required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-2">
          {loading ? 'Mendaftarkan...' : 'Buat Akun'}
        </button>
      </form>
      <p className="text-sm text-center text-neutral-500 mt-5">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-primary-400 hover:underline">Masuk di sini</Link>
      </p>
    </>
  )
}