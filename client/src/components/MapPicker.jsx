import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const DEFAULT_LAT = -6.261493
const DEFAULT_LNG = 106.810600

export default function MapPicker({ onLocationSelect, onAddressFound, initialAddress = '' }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef  = useRef(null)
  const markerRef       = useRef(null)

  const [position, setPosition]       = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG })
  const [searchInput, setSearchInput] = useState(initialAddress)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)

  const handleSearch = async (e) => {
    e?.preventDefault()
    const q = searchInput.trim()
    if (!q) return
    setIsSearching(true)
    setSearchError(null)
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=id`,
        { headers: { 'Accept-Language': 'id', 'User-Agent': 'RekrutRek/1.0' } }
      )
      const data = await res.json()
      if (data.length === 0) {
        setSearchError('Alamat tidak ditemukan. Coba lebih spesifik.')
        return
      }
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      movePin(lat, lng)
      if (onAddressFound) onAddressFound(data[0].display_name)
    } catch {
      setSearchError('Gagal mencari alamat. Cek koneksi internet.')
    } finally {
      setIsSearching(false)
    }
  }

  const movePin = (lat, lng) => {
    setPosition({ lat, lng })
    markerRef.current?.setLatLng([lat, lng])
    mapInstanceRef.current?.setView([lat, lng], 16)
    if (onLocationSelect) onLocationSelect(lat, lng)
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'id', 'User-Agent': 'RekrutRek/1.0' } }
      )
      const data = await res.json()
      if (data?.display_name) {
        setSearchInput(data.display_name)
        if (onAddressFound) onAddressFound(data.display_name)
      }
    } catch { /* silent */ }
  }

  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return

    const map = L.map(mapContainerRef.current).setView(
      [DEFAULT_LAT, DEFAULT_LNG], 13
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    const defaultIcon = L.icon({
      iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize:  [25, 41],
      iconAnchor:[12, 41],
    })

    const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { icon: defaultIcon, draggable: true }).addTo(map)
    markerRef.current = marker

    // Klik peta → pindah pin + reverse geocode
    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      movePin(lat, lng)
      reverseGeocode(lat, lng)
    })

    // Drag pin → update + reverse geocode
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng()
      setPosition({ lat, lng })
      if (onLocationSelect) onLocationSelect(lat, lng)
      reverseGeocode(lat, lng)
    })

    mapInstanceRef.current = map

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, [])

  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => { setSearchInput(e.target.value); setSearchError(null) }}
          placeholder="Ketik nama jalan, kelurahan, kota… lalu Enter"
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#2C263F]/10 bg-[#FDFBF7] text-sm text-[#2C263F] focus:outline-none focus:border-[#F8C662] focus:ring-1 focus:ring-[#F8C662] transition-all"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-4 py-2.5 bg-[#41644A] text-white rounded-xl text-sm font-bold hover:bg-[#213722] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {isSearching ? '...' : '🔍 Cari'}
        </button>
      </form>

      {searchError && (
        <p className="text-xs text-red-500 font-medium px-1">{searchError}</p>
      )}

      {/* Peta */}
      <div
        ref={mapContainerRef}
        className="h-64 w-full rounded-xl overflow-hidden border border-[#2C263F]/10 shadow-sm relative z-0"
      />
  
      <p className="text-xs text-[#2C263F]/50">
        💡 Ketik alamat lalu klik <b>Cari</b>, atau klik/drag pin langsung di peta.
        Koordinat: <span className="font-semibold text-[#2C263F]/70">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</span>
      </p>
    </div>
  )
}
