import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobService, applicationService } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'

export default function JobDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied]   = useState(false)
  const [msg, setMsg]           = useState('')

  useEffect(() => {
    jobService.getById(id)
      .then(res => setJob(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async () => {
    if (!user) { navigate('/login'); return }
    setApplying(true)
    try {
      await applicationService.apply({ job_id: id })
      setApplied(true)
      setMsg('Lamaran berhasil dikirim! Skor kecocokan sedang dihitung.')
    } catch (err) {
      setMsg(err.response?.data?.error || 'Gagal mengirim lamaran')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="card animate-pulse h-64"></div>
  if (!job) return null

  const formatSalary = (n) => n ? 'Rp ' + n.toLocaleString('id-ID') : '-'

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)}
        className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 flex items-center gap-1">
        ← Kembali
      </button>

      <div className="card mb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-xl font-medium text-neutral-900">{job.title}</h1>
          <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0
            ${job.job_type === 'umkm'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
            {job.job_type === 'umkm' ? 'UMKM' : 'Korporat'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-5">
          <div>
            <div className="text-xs text-neutral-400 mb-0.5">Perusahaan</div>
            <div className="text-neutral-700">{job.poster_name || '-'}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-400 mb-0.5">Lokasi</div>
            <div className="text-neutral-700">{job.address || '-'}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-400 mb-0.5">Gaji Min</div>
            <div className="text-neutral-700">{formatSalary(job.salary_min)}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-400 mb-0.5">Gaji Maks</div>
            <div className="text-neutral-700">{formatSalary(job.salary_max)}</div>
          </div>
        </div>

        {job.description && (
          <div className="mb-4">
            <h2 className="text-sm font-medium text-neutral-700 mb-2">Deskripsi</h2>
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        )}

        {job.requirements && (
          <div>
            <h2 className="text-sm font-medium text-neutral-700 mb-2">Persyaratan</h2>
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
              {job.requirements}
            </p>
          </div>
        )}
      </div>

      {msg && (
        <div className={`text-sm rounded-lg px-4 py-3 mb-4 border
          ${applied
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-red-50 text-red-700 border-red-200'}`}>
          {msg}
        </div>
      )}

      {user?.user_type === 'jobseeker' && !applied && (
        <button onClick={handleApply} disabled={applying} className="btn-primary w-full sm:w-auto">
          {applying ? 'Mengirim lamaran...' : 'Lamar Sekarang'}
        </button>
      )}

      {!user && (
        <button onClick={() => navigate('/login')} className="btn-primary w-full sm:w-auto">
          Masuk untuk melamar
        </button>
      )}
    </div>
  )
}