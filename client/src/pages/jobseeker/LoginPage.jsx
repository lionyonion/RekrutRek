import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Store, Building2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [selectedRole, setSelectedRole] = useState('jobseeker');

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Proses Login sebagai: ${selectedRole}\n\nDi sini nanti akan memanggil endpoint backend (contoh: POST /api/auth/login)`);
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-[#F8C662] selection:text-[#2C263F]">
      
      {/* --- PANEL KIRI --- */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#2C263F] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-[#595082] blur-[150px] opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <img 
            src="/logo.jpg" 
            alt="Logo" 
            className="w-10 h-10 rounded-lg object-cover bg-white/5 p-1"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">R</div>
          <h1 className="text-xl font-bold tracking-tight">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
        </div>

        <div className="relative z-10 my-auto">
          <h2 className="text-5xl font-black leading-[1.15] mb-6">
            Rekrutmen <br />cerdas <br /><span className="text-[#F8C662]">berbasis AI</span> <br />untuk semua.
          </h2>
          <p className="text-lg text-white/70 max-w-sm leading-relaxed">
            Dari warung pinggir jalan hingga perusahaan besar. AI kami cocokkan kandidat terbaik.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
          <div>
            <div className="text-2xl font-black text-[#F8C662]">2.4k+</div>
            <div className="text-xs text-white/60 mt-1 font-medium">UMKM Bergabung</div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#F8C662]">18k+</div>
            <div className="text-xs text-white/60 mt-1 font-medium">Pencari Kerja</div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#F8C662]">94%</div>
            <div className="text-xs text-white/60 mt-1 font-medium">Kepuasan</div>
          </div>
        </div>
      </div>

      {/* --- PANEL KANAN --- */}
      <div className="w-full lg:w-7/12 bg-[#FDFBF7] flex flex-col p-6 sm:p-12 lg:px-24 justify-center relative">
        
        <button onClick={() => navigate('/')} className="absolute top-6 left-6 lg:top-12 lg:left-12 flex items-center gap-2 text-sm font-bold text-[#2C263F]/60 hover:text-[#2C263F] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
          
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-[#2C263F]/5 p-1" />
            <h1 className="text-2xl font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
          </div>

          <h2 className="text-3xl font-black text-[#2C263F] mb-2">Masuk ke RekrutRek</h2>
          <p className="text-[#2C263F]/60 mb-8 text-sm">Platform rekrutmen berbasis AI pertama untuk UMKM</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-[#2C263F] mb-2">Email</label>
              <input type="email" placeholder="email@kamu.com" className="w-full px-4 py-3.5 rounded-xl bg-[#3A3635] text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F8C662] transition-shadow" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2C263F] mb-2">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3.5 rounded-xl bg-[#3A3635] text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F8C662] transition-shadow" required />
            </div>
            
            <div className="flex justify-end">
              <a href="#" className="text-sm font-bold text-[#2C263F]/60 hover:text-[#2C263F] transition-colors">Lupa password?</a>
            </div>

            <div className="relative my-4 flex items-center">
              <div className="flex-grow border-t border-[#2C263F]/10"></div>
              <span className="flex-shrink-0 mx-4 text-[#2C263F]/40 text-xs font-semibold uppercase tracking-widest">Atau masuk sebagai</span>
              <div className="flex-grow border-t border-[#2C263F]/10"></div>
            </div>

            <div className="flex flex-col gap-3">
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedRole === 'jobseeker' ? 'border-[#F8C662] bg-[#F8C662]/10' : 'border-[#2C263F]/10 bg-white hover:border-[#2C263F]/20'}`}>
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current" style={{ color: selectedRole === 'jobseeker' ? '#41644A' : '#2C263F' }}>
                  {selectedRole === 'jobseeker' && <div className="w-2.5 h-2.5 rounded-full bg-[#41644A]" />}
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F8C662]/20 text-[#F8C662]">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-[#2C263F] text-sm">Pencari Kerja</div>
                  <div className="text-xs text-[#2C263F]/60">Cari & lamar lowongan</div>
                </div>
                <input type="radio" name="role" value="jobseeker" checked={selectedRole === 'jobseeker'} onChange={() => setSelectedRole('jobseeker')} className="hidden" />
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedRole === 'umkm' ? 'border-[#F8C662] bg-[#F8C662]/10' : 'border-[#2C263F]/10 bg-white hover:border-[#2C263F]/20'}`}>
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current" style={{ color: selectedRole === 'umkm' ? '#41644A' : '#2C263F' }}>
                  {selectedRole === 'umkm' && <div className="w-2.5 h-2.5 rounded-full bg-[#41644A]" />}
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#41644A]/10 text-[#41644A]">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-[#2C263F] text-sm">Pemilik UMKM</div>
                  <div className="text-xs text-[#2C263F]/60">Rekrut karyawan lokal</div>
                </div>
                <input type="radio" name="role" value="umkm" checked={selectedRole === 'umkm'} onChange={() => setSelectedRole('umkm')} className="hidden" />
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedRole === 'corporate' ? 'border-[#F8C662] bg-[#F8C662]/10' : 'border-[#2C263F]/10 bg-white hover:border-[#2C263F]/20'}`}>
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current" style={{ color: selectedRole === 'corporate' ? '#41644A' : '#2C263F' }}>
                  {selectedRole === 'corporate' && <div className="w-2.5 h-2.5 rounded-full bg-[#41644A]" />}
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#595082]/10 text-[#595082]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-[#2C263F] text-sm">HR Korporat</div>
                  <div className="text-xs text-[#2C263F]/60">Manajemen rekrutmen</div>
                </div>
                <input type="radio" name="role" value="corporate" checked={selectedRole === 'corporate'} onChange={() => setSelectedRole('corporate')} className="hidden" />
              </label>
            </div>

            <button type="submit" className="w-full mt-4 py-4 rounded-xl font-bold text-white transition-transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(44,38,63,0.2)]" style={{ background: `linear-gradient(135deg, #2C263F, #15121F)` }}>
              Masuk Sekarang
            </button>
            
            <div className="text-center mt-2 text-sm text-[#2C263F]/60 font-medium">
              Belum punya akun? <a href="#" className="text-[#2C263F] font-bold hover:underline">Daftar di sini</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}