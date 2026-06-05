import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const makeCircleIcon = (color, size = 14) =>
  L.divIcon({
    html: `<div style="background:${color};border:3px solid white;width:${size}px;height:${size}px;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })

const USER_ICON = makeCircleIcon('#F8C662', 20)
const UMKM_ICON = makeCircleIcon('#41644A')
const CORP_ICON = makeCircleIcon('#595082')

const fmt = (n) => n ? `Rp ${(n / 1e6).toFixed(1).replace('.0', '')}Jt` : null

export default function JobMapView({ userLocation, jobs }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    if (instanceRef.current) {
      instanceRef.current.remove()
      instanceRef.current = null
    }

    const center = userLocation
      ? [userLocation.lat, userLocation.lng]
      : [-6.2615, 106.8106]

    const map = L.map(mapRef.current).setView(center, 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(map)

    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], { icon: USER_ICON })
        .addTo(map)
        .bindPopup('<b>📍 Lokasi Anda</b><br/><span style="font-size:12px;color:#666">Posisi saat ini</span>')
        .openPopup()
    }

    jobs.forEach((job) => {
      if (!job.latitude || !job.longitude) return
      const icon = job.job_type === 'umkm' ? UMKM_ICON : CORP_ICON
      const distText = job.distance_km != null
        ? `<br/><span style="color:#41644A;font-weight:bold">📏 ${job.distance_km} km dari Anda</span>`
        : ''
      const salMin = fmt(job.salary_min)
      const salMax = fmt(job.salary_max)
      const salText = (salMin || salMax)
        ? `<br/><span style="color:#666;font-size:11px">💰 ${[salMin, salMax].filter(Boolean).join(' - ')}</span>`
        : ''
      const typeLabel = job.job_type === 'umkm'
        ? '<span style="background:#dcfce7;color:#166534;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:bold">UMKM</span>'
        : '<span style="background:#ede9fe;color:#4c1d95;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:bold">CORP</span>'

      L.marker([parseFloat(job.latitude), parseFloat(job.longitude)], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:160px">
            <b style="font-size:13px">${job.title}</b><br/>
            <span style="color:#888;font-size:12px">${job.poster_name || ''}</span>
            ${distText}${salText}<br/>
            <div style="margin-top:4px">${typeLabel}</div>
          </div>`
        )
    })

    instanceRef.current = map
    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
      }
    }
  }, [userLocation?.lat, userLocation?.lng, jobs.length])

  const jobsOnMap = jobs.filter((j) => j.latitude && j.longitude)

  return (
    <div className="w-full">
      {!userLocation && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 font-medium">
          ⚠️ Set lokasi GPS di halaman <b>Profil</b> agar jarak ke lowongan bisa ditampilkan.
        </div>
      )}
      <div className="flex flex-wrap gap-4 mb-3 text-xs font-bold text-[#2C263F]/60">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#F8C662] border-2 border-white shadow inline-block" /> Lokasi Anda
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#41644A] border-2 border-white shadow inline-block" />
          UMKM ({jobs.filter((j) => j.job_type === 'umkm' && j.latitude).length})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#595082] border-2 border-white shadow inline-block" />
          Corporate ({jobs.filter((j) => j.job_type === 'corporate' && j.latitude).length})
        </span>
      </div>
      <div ref={mapRef} style={{ height: '420px' }} className="w-full rounded-2xl overflow-hidden border border-[#2C263F]/10 shadow-sm" />
      {jobsOnMap.length === 0 && jobs.length > 0 && (
        <p className="text-xs text-[#2C263F]/40 mt-2 text-center">
          Belum ada lowongan dengan data koordinat yang bisa ditampilkan di peta.
        </p>
      )}
    </div>
  )
}