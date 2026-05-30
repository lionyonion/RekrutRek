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
  
  const [step, setStep] = useState(1) 
  
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    confirm_password: '',
    user_type: '',
    pic_name: '',
    company_name: '',
    whatsapp: ''
  })
  
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleRoleSelection = (roleValue) => {
    setForm({ ...form, user_type: roleValue })
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (form.user_type !== 'jobseeker') {
      if (form.password !== form.confirm_password) {
        setError('Kata sandi dan ulangi kata sandi tidak cocok!');
        return;
      }
    }

    setLoading(true); setError('')
    try {
      const user = await register(form.email, form.password, form.user_type, {
        pic_name: form.pic_name,
        company_name: form.company_name,
        whatsapp: form.whatsapp
      })
      
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

      {/* --- TAHAP 1: LAYAR PEMILIHAN PERAN --- */}
      {step === 1 && (
        <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-in-out]">
          <label className="text-sm text-neutral-600 block mb-1">Saya adalah...</label>
          <div className="flex flex-col gap-3">
            {USER_TYPES.map(t => (
              <div 
                key={t.value}
                onClick={() => handleRoleSelection(t.value)}
                className="flex items-start gap-3 border border-neutral-200 rounded-lg p-4 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-neutral-800">{t.label}</div>
                  <div className="text-xs text-neutral-500 mt-1">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAHAP 2: LAYAR FORMULIR REGISTRASI --- */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-in-out]">

          {/* Form Ekstra Khusus UMKM / Korporat */}
          {(form.user_type === 'umkm' || form.user_type === 'corporate') && (
            <>
              <div>
                <label className="text-sm text-neutral-600 block mb-1">Nama Lengkap PIC</label>
                <input type="text" className="input-field" placeholder="Masukkan nama lengkap PIC"
                  value={form.pic_name} onChange={e => setForm({ ...form, pic_name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm text-neutral-600 block mb-1">Nama Perusahaan</label>
                <input type="text" className="input-field" placeholder="Masukkan nama perusahaan"
                  value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm text-neutral-600 block mb-1">Nomor Whatsapp PIC</label>
                <input type="tel" className="input-field" placeholder="Masukkan nomor whatsapp PIC"
                  value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} required />
                <p className="text-[10px] text-green-600 mt-1">
                  <span className="mr-1">ℹ️</span> Pastikan nomor whatsapp valid untuk keperluan verifikasi
                </p>
              </div>
            </>
          )}

          {/* Form Dasar untuk Semua (Email & Password) */}
          <div>
            <label className="text-sm text-neutral-600 block mb-1">Email</label>
            <input type="email" className="input-field" placeholder="email@kamu.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div>
            <label className="text-sm text-neutral-600 block mb-1">Kata Sandi</label>
            <input type="password" className="input-field" placeholder="Buat kata sandi"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              minLength={8} required />
          </div>

          {(form.user_type === 'umkm' || form.user_type === 'corporate') && (
            <div>
              <label className="text-sm text-neutral-600 block mb-1">Ulangi Kata Sandi</label>
              <input type="password" className="input-field" placeholder="Buat ulang kata sandi"
                value={form.confirm_password} onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                minLength={8} required />
            </div>
          )}

          {/* Area Tombol Aksi Tumpuk di Bawah */}
          <div className="flex flex-col mt-2 pt-2 border-t border-neutral-100">
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="text-sm text-neutral-500 hover:text-primary-600 font-medium self-start mb-4 transition-colors"
            >
              &larr; Kembali
            </button>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
          </div>

        </form>
      )}

      <p className="text-sm text-center text-neutral-500 mt-5">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-primary-400 hover:underline">Masuk di sini</Link>
      </p>
    </>
  )
}