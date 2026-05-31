import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, Store, Building2, 
  MapPin, Cpu, Users, ChevronRight, Sparkles, Target, LogIn
} from "lucide-react";

// --- DATA PENDIRI ---
const founders = [
  { name: "Nama Pendiri 1", role: "Chief Executive Officer", initials: "P1" },
  { name: "Nama Pendiri 2", role: "Chief Technology Officer", initials: "P2" },
  { name: "Nama Pendiri 3", role: "Chief Operating Officer", initials: "P3" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  // Tema Warna Permanen (Sesuai Palet: Ultra Violet & Dark Purple)
  const theme = {
    appBg: "linear-gradient(180deg, #2C263F 0%, #15121F 100%)", // Dark Purple base
    card: "rgba(89, 80, 130, 0.25)", // Ultra Violet transparent
    border: "rgba(248, 198, 98, 0.2)", // Saffron border
    text: "#FDFBF7",
    muted: "rgba(253, 251, 247, 0.65)",
    pill: "rgba(248, 198, 98, 0.15)",
    rekColor: "#F8C662", // Saffron
    rekrutColor: "#41644A" // Hunter Green
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden antialiased font-sans selection:bg-[#F8C662] selection:text-[#2C263F]"
      style={{ background: theme.appBg, color: theme.text }}
    >
      {/* --- Efek Cahaya Latar Belakang Violet --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#595082] blur-[150px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#2C263F] blur-[150px] opacity-80 pointer-events-none" />

      {/* --- KONTEN UTAMA --- */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 relative z-10">
        
        {/* --- NAVBAR --- */}
        <header className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-4">
            {}
            <img 
              src="/logo.jpg" 
              alt="Logo RekrutRek" 
              className="w-12 h-12 rounded-xl object-cover shadow-lg bg-white/5 p-1"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight m-0 leading-none">
                <span className="text-white">Rekrut</span>
                <span style={{ color: theme.rekColor }}>Rek</span>
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex gap-8 text-sm font-semibold" style={{ color: theme.muted }}>
            <a href="#tentang" className="hover:text-white transition-colors">Tentang RekrutRek</a>
            <a href="#fitur" className="hover:text-white transition-colors">Keunggulan AI</a>
            <a href="#pendiri" className="hover:text-white transition-colors">Tim Pendiri</a>
          </div>
        </header>

        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32" id="tentang">
          <div className="flex flex-col gap-6">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs tracking-wide w-fit border"
              style={{ background: theme.pill, color: theme.rekColor, borderColor: theme.border }}
            >
              <Sparkles className="w-4 h-4" />
              Sistem Rekrutmen Masa Depan
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Revolusi Karir <br/>
              dengan Kekuatan <span style={{ color: theme.rekColor }}>AI.</span>
            </h2>
            
            <p className="text-lg leading-relaxed max-w-lg" style={{ color: theme.muted }}>
              RekrutRek adalah platform cerdas yang menghubungkan talenta terbaik dengan UMKM dan Perusahaan Besar. Kami menggunakan Artificial Intelligence untuk mencocokkan skill, gaji, hingga jarak lokasi kerja secara akurat.
            </p>
          </div>

          {/* --- KOTAK MENU LOGIN / REGISTER --- */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <LogIn className="w-5 h-5" style={{ color: theme.rekColor }} />
              <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: theme.muted }}>Masuk ke Portal</h3>
            </div>
            
            {/* Tombol Pelamar */}
            <button 
              onClick={() => navigate('/jobseeker/login')}
              className="group flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg"
              style={{ background: theme.card, borderColor: theme.border, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
                  <Briefcase className="w-6 h-6" style={{ color: theme.rekColor }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Portal Pelamar</h4>
                  <p className="text-sm" style={{ color: theme.muted }}>Daftar, upload CV, dan cari lowongan.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            {/* Tombol UMKM */}
            <button 
              onClick={() => navigate('/umkm/login')}
              className="group flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg"
              style={{ background: theme.card, borderColor: theme.border, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
                  <Store className="w-6 h-6" style={{ color: theme.rekColor }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Portal UMKM</h4>
                  <p className="text-sm" style={{ color: theme.muted }}>Cari karyawan lokal terdekat dengan cepat.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            {/* Tombol Corporate */}
            <button 
              onClick={() => navigate('/corporate/login')}
              className="group flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg"
              style={{ background: theme.card, borderColor: theme.border, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
                  <Building2 className="w-6 h-6" style={{ color: theme.rekColor }} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Portal Corporate</h4>
                  <p className="text-sm" style={{ color: theme.muted }}>Manajemen rekrutmen berbasis AI screening.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* --- FITUR UNGGULAN --- */}
        <div id="fitur" className="py-20 border-t" style={{ borderColor: theme.border }}>
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Kenapa Memilih RekrutRek?</h3>
            <p className="max-w-xl mx-auto" style={{ color: theme.muted }}>Kami menghilangkan proses rekrutmen manual yang membosankan dengan teknologi canggih.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[32px] border backdrop-blur-md text-center hover:bg-white/5 transition-colors" style={{ background: theme.card, borderColor: theme.border }}>
              <Cpu className="w-12 h-12 mx-auto mb-6" style={{ color: theme.rekColor }} />
              <h4 className="text-xl font-bold mb-3">AI CV Extraction</h4>
              <p className="text-sm leading-relaxed" style={{ color: theme.muted }}>Sistem membaca dan mengekstrak skill serta pengalaman dari CV pelamar secara otomatis tanpa input manual.</p>
            </div>
            <div className="p-10 rounded-[32px] border backdrop-blur-md text-center hover:bg-white/5 transition-colors" style={{ background: theme.card, borderColor: theme.border }}>
              <MapPin className="w-12 h-12 mx-auto mb-6" style={{ color: theme.rekColor }} />
              <h4 className="text-xl font-bold mb-3">Distance Matching</h4>
              <p className="text-sm leading-relaxed" style={{ color: theme.muted }}>Memprioritaskan kandidat yang berada di lokasi terdekat, sangat cocok untuk kebutuhan operasional UMKM.</p>
            </div>
            <div className="p-10 rounded-[32px] border backdrop-blur-md text-center hover:bg-white/5 transition-colors" style={{ background: theme.card, borderColor: theme.border }}>
              <Target className="w-12 h-12 mx-auto mb-6" style={{ color: theme.rekColor }} />
              <h4 className="text-xl font-bold mb-3">Smart Ranking</h4>
              <p className="text-sm leading-relaxed" style={{ color: theme.muted }}>Tidak perlu sortir ribuan pelamar. AI kami memberikan skor dan peringkat kecocokan secara real-time.</p>
            </div>
          </div>
        </div>

        {/* --- FOUNDERS SECTION --- */}
        <div id="pendiri" className="py-20 border-t" style={{ borderColor: theme.border }}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 rounded-full mb-6 bg-white/5 border" style={{ borderColor: theme.border }}>
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Tim di Balik RekrutRek</h3>
            <p className="max-w-xl mx-auto" style={{ color: theme.muted }}>Inovator yang berdedikasi membangun ekosistem karir yang lebih inklusif dan efisien.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {founders.map((founder, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div 
                  className="w-32 h-32 rounded-full mb-6 flex items-center justify-center text-3xl font-black border-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(248,198,98,0.3)]"
                  style={{ background: theme.card, borderColor: theme.border, color: theme.rekColor }}
                >
                  {/* Tempat untuk foto asli pendiri (<img>) nantinya */}
                  {founder.initials}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{founder.name}</h4>
                <p className="text-sm font-medium" style={{ color: theme.rekColor }}>{founder.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="mt-10 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-6" style={{ borderColor: theme.border, color: theme.muted }}>
          <div className="flex items-center gap-2">
            {}
            <img 
              src="/logo.jpg" 
              alt="Logo RekrutRek" 
              className="w-8 h-8 rounded-lg object-cover bg-white/5 p-0.5"
            />
            <span className="font-bold text-white">RekrutRek</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Capstone Project. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
}