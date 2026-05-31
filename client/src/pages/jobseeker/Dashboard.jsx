import React, { useState, useEffect, useRef } from 'react';
// Pastikan path MapPicker ini benar ya!
import MapPicker from '../../components/MapPicker'; 

export default function Dashboard() {
  // 1. STATE UNTUK LEBAR KOLOM KIRI (Default 35%)
  const [leftWidth, setLeftWidth] = useState(35);
  const isResizing = useRef(false);

  // 2. FUNGSI UNTUK MENGATUR DRAG & DROP
  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Biar teks nggak ke-blok pas ditarik
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  };

  const resize = (e) => {
    if (isResizing.current) {
      // Hitung posisi mouse jadi persentase
      const newWidth = (e.clientX / window.innerWidth) * 100;
      // Batasi tarikan: minimal 20% layar, maksimal 70% layar
      if (newWidth >= 20 && newWidth <= 70) {
        setLeftWidth(newWidth);
      }
    }
  };

  // Pasang sensor mouse ke seluruh layar
  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      
      {/* HEADER & SEARCH BAR */}
      <div className="p-4 bg-white border-b shadow-sm z-10">
        <h1 className="text-xl font-bold text-blue-600 mb-3">Dashboard Pencari Kerja</h1>
        <div className="flex gap-2">
          <input type="text" placeholder="Posisi (cth: Kasir)" className="border p-2 rounded-lg w-full outline-none focus:border-blue-500" />
          <input type="text" placeholder="Lokasi (cth: Jakarta Selatan)" className="border p-2 rounded-lg w-full outline-none focus:border-blue-500" />
          <input type="number" placeholder="Ekspektasi Gaji" className="border p-2 rounded-lg w-full outline-none focus:border-blue-500" />
        </div>
      </div>

      {/* MAIN CONTENT (Custom Resizable) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Kolom Kiri: Daftar List Lowongan */}
        <div 
          style={{ width: `${leftWidth}%` }} 
          className="bg-white overflow-y-auto p-4 flex-shrink-0"
        >
            <h2 className="font-semibold mb-4 text-lg">Daftar Lowongan UMKM</h2>
            
            {/* Card Pekerjaan 1 */}
            <div className="p-4 mb-3 border rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md cursor-pointer transition-all">
              <h3 className="font-bold text-lg text-neutral-800">Penjaga Toko Roti</h3>
              <p className="text-sm text-neutral-500">Toko Roti Kukus Jaya</p>
              <p className="text-sm font-bold text-green-600 mt-2">Rp 2.000.000 / bln</p>
            </div>

            {/* Card Pekerjaan 2 */}
            <div className="p-4 mb-3 border rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md cursor-pointer transition-all">
              <h3 className="font-bold text-lg text-neutral-800">Barista Kopi</h3>
              <p className="text-sm text-neutral-500">Kopi Senja</p>
              <p className="text-sm font-bold text-green-600 mt-2">Rp 2.500.000 / bln</p>
            </div>
        </div>

        {/* GARIS PEMBATAS (Tarik di sini!) */}
        <div 
          onMouseDown={startResizing}
          className="w-2 bg-neutral-200 hover:bg-blue-400 active:bg-blue-600 cursor-col-resize transition-colors z-10 flex flex-col justify-center items-center"
        >
          {/* Titik kecil pemanis biar kelihatan bisa ditarik */}
          <div className="h-8 w-1 bg-neutral-400 rounded-full"></div>
        </div>

        {/* Kolom Kanan: Peta */}
        <div 
          style={{ width: `${100 - leftWidth}%` }} 
          className="bg-neutral-100 relative flex-shrink-0"
        >
          <div className="absolute inset-0">
             <MapPicker onLocationSelect={(lat, lng) => console.log("Koordinat:", lat, lng)} />
          </div>
        </div>
        
      </div>

      {/* AI MATCHMAKER BUTTON */}
      <div className="p-4 bg-white border-t z-10">
        <button className="w-full py-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 font-bold text-lg transition-colors">
          ✨ Matchmaker AI: Cari Lowongan Paling Cocok
        </button>
      </div>

    </div>
  );
}

// Sub-komponen Statistik
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border border-neutral-200 p-5 rounded-2xl flex items-center gap-4">
      <div className="p-3 bg-neutral-100 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-black text-neutral-900">{value}</p>
      </div>
    </div>
  );
}