import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapPicker({ onLocationSelect }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState({ lat: -6.261493, lng: 106.810600 });

  useEffect(() => {
    // Mencegah peta render ganda di React
    if (!mapInstanceRef.current && mapContainerRef.current) {
      
      // 1. Inisialisasi peta Leaflet murni
      const map = L.map(mapContainerRef.current).setView([position.lat, position.lng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // 2. Fix icon bawaan leaflet yang sering hilang di React
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });

      // 3. Tambahkan Pin (Marker) ke peta
      const marker = L.marker([position.lat, position.lng], { icon: defaultIcon }).addTo(map);
      markerRef.current = marker;

      // 4. Event saat area peta diklik
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]); // Geser pin
        setPosition({ lat, lng });    // Update angka di layar
        
        if (onLocationSelect) {
          onLocationSelect(lat, lng); // Kirim ke halaman formulir
        }
      });

      mapInstanceRef.current = map;
    }

    // Cleanup memori saat pindah halaman
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); 

  return (
    <div className="w-full mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Tandai Lokasi di Peta
      </label>
      
      {/* Wadah Peta */}
      <div 
        ref={mapContainerRef} 
        className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 relative z-0"
      ></div>
      
      <p className="text-xs text-gray-500 mt-2">
        *Klik area peta untuk menggeser pin lokasi.<br/>
        Koordinat terpilih: <span className="font-semibold text-gray-700">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</span>
      </p>
    </div>
  );
}