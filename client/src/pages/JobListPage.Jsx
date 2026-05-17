import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobService } from '@/services/api'

function JobCard({ job }) {
  const typeLabel = job.job_type === 'umkm' ? 'UMKM' : 'Korporat'
  const typeColor = job.job_type === 'umkm'
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-blue-50 text-blue-700 border-blue-200'

  const formatSalary = (n) => n
    ? 'Rp ' + (n / 1000000).toFixed(1) + ' jt'
    : null

  return (
    <Link to={`/jobs/${job.id}`}
      className="card block hover:border-neutral-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="font-medium text-neutral-900 text-sm sm:text-base leading-snug">
          {job.title}
        </h2>
        <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${typeColor}`}>
          {typeLabel}
        </span>
      </div>
      {job.poster_name && (
        <p className="text-sm text-neutral-500 mb-2">{job.poster_name}</p>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
        {job.address && <span>📍 {job.address}</span>}
        {(job.salary_min || job.salary_max) && (
          <span>💰 {formatSalary(job.salary_min)} – {formatSalary(job.salary_max)}</span>
        )}
        {job.distance_km != null && <span>🚗 {job.distance_km} km</span>}
        {job.match_score != null && (
          <span className="text-primary-600 font-medium">
            ✦ Cocok {Math.round(job.match_score)}%
          </span>
        )}
      </div>
    </Link>
  )
}

export default function JobListPage() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    const params = filter !== 'all' ? { type: filter } : {}
    jobService.getAll(params)
      .then(res => setJobs(res.data.jobs || []))
      .catch(() => setError('Gagal memuat lowongan'))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-medium text-neutral-900 mb-1">
          Lowongan Tersedia
        </h1>
        <p className="text-sm text-neutral-500">
          Temukan pekerjaan yang cocok denganmu
        </p>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {['all','umkm','corporate'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors
              ${filter === f
                ? 'bg-primary-400 text-white border-primary-400'
                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
            {f === 'all' ? 'Semua' : f === 'umkm' ? 'UMKM' : 'Korporat'}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-2/3 mb-3"></div>
              <div className="h-3 bg-neutral-100 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card text-center text-neutral-500 py-8">
          {error} — pastikan backend sudah running
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="card text-center py-10">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-neutral-600 font-medium">Belum ada lowongan</p>
          <p className="text-sm text-neutral-400 mt-1">
            Coba ganti filter atau kembali lagi nanti
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {jobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  )
}