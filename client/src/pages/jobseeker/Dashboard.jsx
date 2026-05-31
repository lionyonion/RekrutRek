import React from 'react';
import { 
  CheckCircle2, FileText, MapPin, 
  Cpu, Bell, Briefcase, Store 
} from 'lucide-react';

export default function Dashboard() {
  // Dummy data untuk simulasi
  const jobs = [
    { id: 1, title: "Barista & Kasir", org: "Kopi Kenangan Senja", dist: "1.2 km", salary: "2.5 - 3 Jt", score: 95 },
    { id: 2, title: "Admin Gudang", org: "Toko Sembako Maju", dist: "3.5 km", salary: "2 - 2.5 Jt", score: 88 },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      
      {/* 1. WELCOME SECTION */}
      <div>
        <h1 className="text-3xl font-black text-neutral-900">Halo, Naila! 👋</h1>
        <p className="text-neutral-500 mt-1">Berikut adalah rekomendasi lowongan berdasarkan skill dan lokasimu.</p>
      </div>

      {/* 2. PROFILE COMPLETION CARD */}
      <div className="bg-[#595082] rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg shadow-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-[#F8C662]" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Lengkapi Profilmu</h3>
            <p className="text-white/80 text-sm max-w-sm">Tingkatkan peluang dipanggil wawancara hingga 80% dengan mengunggah foto, CV, dan mengatur lokasi GPS kamu.</p>
          </div>
        </div>
        <button className="bg-[#F8C662] text-[#2C263F] px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
          Lengkapi Sekarang
        </button>
      </div>

      {/* 3. QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Lamaran Aktif" value="5" icon={<Briefcase className="w-5 h-5 text-green-600" />} />
        <StatCard title="Interview" value="2" icon={<FileText className="w-5 h-5 text-blue-600" />} />
        <StatCard title="Notifikasi Baru" value="3" icon={<Bell className="w-5 h-5 text-orange-600" />} />
      </div>

      {/* 4. AI MATCH RECOMMENDATIONS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black flex items-center gap-2 text-neutral-900">
            <Cpu className="w-5 h-5 text-green-700" /> Rekomendasi AI Match
          </h2>
          <button className="text-sm font-bold text-green-700 hover:underline">Lihat Semua</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="border border-neutral-200 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-neutral-600" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">{job.score}% Cocok</div>
                </div>
              </div>
              <h4 className="font-bold text-lg text-neutral-900">{job.title}</h4>
              <p className="text-sm text-neutral-500 mb-4">{job.org}</p>
              
              <div className="flex gap-2 text-xs font-medium text-neutral-600 mb-6">
                <span className="bg-neutral-100 px-2 py-1 rounded-md flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.dist}</span>
                <span className="bg-neutral-100 px-2 py-1 rounded-md">$ {job.salary}</span>
              </div>
              
              <button className="w-full bg-[#213722] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1a2d1b] transition-colors">
                Lamar
              </button>
            </div>
          ))}
        </div>
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