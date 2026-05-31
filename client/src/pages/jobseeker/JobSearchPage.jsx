import React, { useState, useMemo } from 'react';
import { Search, MapPin, DollarSign, Store, Building2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Data dummy untuk simulasi pencarian
const allJobs = [
  { id: 1, title: "Frontend Developer", org: "PT Rekrutrek", type: "corporate", salary: "6-8 Jt", location: "Jakarta Selatan", score: 96, dist: 5 },
  { id: 2, title: "Admin Toko", org: "UMKM Berkah", type: "umkm", salary: "2.5 Jt", location: "Jaksel", score: 91, dist: 2.5 },
  { id: 3, title: "Kasir & Barista", org: "UMKM Maju Jaya", type: "umkm", salary: "2.8 Jt", location: "Jaksel", score: 92, dist: 1.2 },
  { id: 4, title: "Backend Engineer", org: "Startup Nusantara", type: "corporate", salary: "8-12 Jt", location: "Jakarta Pusat", score: 89, dist: 8 },
  { id: 5, title: "Staff Gudang", org: "Toko Sembako Makmur", type: "umkm", salary: "2.2 Jt", location: "Jaksel", score: 85, dist: 1.8 },
];

export default function JobSearchPage() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState('');

  // Logika filter & search
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchType = filterType === 'all' || job.type === filterType;
      const matchSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.org.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [filterType, searchQuery]);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto min-h-screen font-sans text-[#2C263F] bg-[#FDFBF7]">
      {/* Tombol Kembali */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-[#2C263F]/60 hover:text-[#2C263F] transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>

      <h2 className="text-3xl font-black mb-6">Cari Lowongan Kerja</h2>

      {/* SEARCH & FILTER AREA */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C263F]/40" />
          <input 
            type="text" 
            placeholder="Cari posisi atau nama perusahaan..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#2C263F]/10 focus:border-[#F8C662] outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Chip */}
        <div className="flex flex-wrap gap-2">
          {['all', 'umkm', 'corporate'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2 rounded-xl font-bold text-sm capitalize transition-all ${
                filterType === type 
                  ? 'bg-[#213722] text-white shadow-lg shadow-[#213722]/20' 
                  : 'bg-white border border-[#2C263F]/10 hover:bg-[#FDFBF7]'
              }`}
            >
              {type === 'all' ? 'Semua' : type}
            </button>
          ))}
        </div>
      </div>

      {/* LIST LOWONGAN */}
      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-[#2C263F]/10 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${job.type === 'umkm' ? 'bg-green-100' : 'bg-purple-100'}`}>
                  {job.type === 'umkm' ? <Store className="w-6 h-6 text-green-700" /> : <Building2 className="w-6 h-6 text-purple-700" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${job.type === 'umkm' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                      {job.type === 'umkm' ? '🟢 UMKM' : '🟣 Corporate'}
                    </span>
                    <span className="text-xs font-medium text-[#2C263F]/50 flex items-center gap-1">
                      <MapPin className="w-3 h-3"/> {job.location}
                    </span>
                  </div>
                  <h4 className="font-black text-lg">{job.title}</h4>
                  <p className="text-sm font-medium text-[#2C263F]/60">{job.org}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-sm font-bold"><DollarSign className="w-4 h-4"/> {job.salary}</div>
                  <div className="text-xs text-[#2C263F]/50">{job.dist} km</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-[#2C263F]/40">AI Score</div>
                  <div className="font-black text-[#41644A]">{job.score}%</div>
                </div>
                <button className="px-6 py-3 bg-[#2C263F] text-white rounded-xl font-bold text-sm hover:bg-[#15121F] transition-colors">Detail</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 opacity-50 font-medium">Tidak ada lowongan ditemukan.</div>
        )}
      </div>
    </div>
  );
}