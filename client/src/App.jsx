import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Briefcase, Store, Building2, 
  MapPin, Cpu, Users, ChevronRight, Sparkles, Target, LogIn, ArrowLeft, Mail, Lock, User, Phone, CheckCircle,
  Home, Search, FileText, Bell, LogOut, Bookmark, DollarSign, HeartHandshake, Video, UploadCloud, Camera, X, Loader2, CheckSquare
} from "lucide-react";

// --- THEME ---
const theme = {
  appBg: "linear-gradient(180deg, #2C263F 0%, #15121F 100%)",
  card: "rgba(89, 80, 130, 0.25)",
  border: "rgba(248, 198, 98, 0.2)",
  text: "#FDFBF7",
  muted: "rgba(253, 251, 247, 0.65)",
  pill: "rgba(248, 198, 98, 0.15)",
  rekColor: "#F8C662",
  rekrutColor: "#41644A",
  corporateColor: "#595082"
};

// --- DATA KONFIGURASI ROLE ---
const roleConfig = {
  jobseeker: {
    id: 'jobseeker',
    title: 'Pelamar',
    icon: <Briefcase className="w-6 h-6" />,
    color: theme.rekrutColor, // Dark Green
    loginDesc: 'Cari dan lamar pekerjaan impianmu.',
    registerDesc: 'Daftar sekarang untuk menemukan lowongan yang sesuai.',
  },
  umkm: {
    id: 'umkm',
    title: 'UMKM',
    icon: <Store className="w-6 h-6" />,
    color: theme.rekColor, // Saffron
    loginDesc: 'Kelola rekrutmen karyawan lokal untuk usahamu.',
    registerDesc: 'Buat akun UMKM untuk mulai mencari kandidat.',
  },
  corporate: {
    id: 'corporate',
    title: 'Corporate',
    icon: <Building2 className="w-6 h-6" />,
    color: theme.corporateColor, // Ultra Violet
    loginDesc: 'Akses sistem AI screening untuk perusahaanmu.',
    registerDesc: 'Daftarkan perusahaanmu untuk rekrutmen profesional.',
  }
};

// ==========================================
// 1. KOMPONEN LANDING PAGE
// ==========================================
function LandingPage() {
  const navigate = useNavigate();
  // Tambahkan 3 pendiri lagi ke dalam array
  const founders = [
    { name: "Nama Pendiri 1", role: "Chief Executive Officer", initials: "P1" },
    { name: "Nama Pendiri 2", role: "Chief Technology Officer", initials: "P2" },
    { name: "Nama Pendiri 3", role: "Chief Operating Officer", initials: "P3" },
    { name: "Nama Pendiri 4", role: "Chief Marketing Officer", initials: "P4" },
    { name: "Nama Pendiri 5", role: "Chief Financial Officer", initials: "P5" },
    { name: "Nama Pendiri 6", role: "Lead Product Designer", initials: "P6" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden antialiased font-sans selection:bg-[#F8C662] selection:text-[#2C263F]" style={{ background: theme.appBg, color: theme.text }}>
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#595082] blur-[150px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#2C263F] blur-[150px] opacity-80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 relative z-10">
        <header className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="Logo RekrutRek" className="w-12 h-12 rounded-xl object-cover bg-white/5 p-1 shadow-lg" 
                 onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="hidden w-12 h-12 rounded-xl items-center justify-center text-2xl font-black shadow-lg" style={{ background: `linear-gradient(135deg, ${theme.rekrutColor}, #213722)`, color: theme.rekColor }}>R</div>
            <h1 className="text-2xl font-bold tracking-tight m-0 leading-none">
              <span className="text-white">Rekrut</span><span style={{ color: theme.rekColor }}>Rek</span>
            </h1>
          </div>
          <div className="hidden sm:flex gap-8 text-sm font-semibold" style={{ color: theme.muted }}>
            <a href="#tentang" className="hover:text-white transition-colors">Tentang RekrutRek</a>
            <a href="#fitur" className="hover:text-white transition-colors">Keunggulan AI</a>
            <a href="#pendiri" className="hover:text-white transition-colors">Tim Pendiri</a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32" id="tentang">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs tracking-wide w-fit border" style={{ background: theme.pill, color: theme.rekColor, borderColor: theme.border }}>
              <Sparkles className="w-4 h-4" /> Sistem Rekrutmen Masa Depan
            </div>
            <h2 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Revolusi Karir <br/> dengan Kekuatan <span style={{ color: theme.rekColor }}>AI.</span>
            </h2>
            <p className="text-lg leading-relaxed max-w-lg" style={{ color: theme.muted }}>
              RekrutRek adalah platform cerdas yang menghubungkan talenta terbaik dengan UMKM dan Perusahaan Besar. Kami menggunakan Artificial Intelligence untuk mencocokkan skill, gaji, hingga jarak lokasi kerja secara akurat.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <LogIn className="w-5 h-5" style={{ color: theme.rekColor }} />
              <h3 className="text-sm font-bold tracking-widest uppercase" style={{ color: theme.muted }}>Masuk ke Portal</h3>
            </div>
            {['jobseeker', 'umkm', 'corporate'].map((roleKey) => {
              const conf = roleConfig[roleKey];
              return (
                <button key={roleKey} onClick={() => navigate(`/login/${roleKey}`)} className="group flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg" style={{ background: theme.card, borderColor: theme.border, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center border bg-white/5" style={{ borderColor: theme.border, color: conf.color }}>
                      {conf.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">Portal {conf.title}</h4>
                      <p className="text-sm" style={{ color: theme.muted }}>{conf.loginDesc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              )
            })}
          </div>
        </div>

        <div id="fitur" className="py-20 border-t" style={{ borderColor: theme.border }}>
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Kenapa Memilih RekrutRek?</h3>
            <p className="max-w-xl mx-auto" style={{ color: theme.muted }}>Kami menghilangkan proses rekrutmen manual yang membutuhkan waktu yang lama dengan teknologi canggih.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[32px] border backdrop-blur-md text-center hover:bg-white/5 transition-colors" style={{ background: theme.card, borderColor: theme.border }}>
              <Cpu className="w-12 h-12 mx-auto mb-6" style={{ color: theme.rekColor }} />
              <h4 className="text-xl font-bold mb-3">AI CV Extraction</h4>
              <p className="text-sm leading-relaxed" style={{ color: theme.muted }}>Sistem membaca dan mengekstrak skill serta pengalaman dari CV pelamar otomatis.</p>
            </div>
            <div className="p-10 rounded-[32px] border backdrop-blur-md text-center hover:bg-white/5 transition-colors" style={{ background: theme.card, borderColor: theme.border }}>
              <MapPin className="w-12 h-12 mx-auto mb-6" style={{ color: theme.rekColor }} />
              <h4 className="text-xl font-bold mb-3">Distance Matching</h4>
              <p className="text-sm leading-relaxed" style={{ color: theme.muted }}>Memprioritaskan kandidat di lokasi terdekat, sangat cocok untuk operasional UMKM.</p>
            </div>
            <div className="p-10 rounded-[32px] border backdrop-blur-md text-center hover:bg-white/5 transition-colors" style={{ background: theme.card, borderColor: theme.border }}>
              <Target className="w-12 h-12 mx-auto mb-6" style={{ color: theme.rekColor }} />
              <h4 className="text-xl font-bold mb-3">Smart Ranking</h4>
              <p className="text-sm leading-relaxed" style={{ color: theme.muted }}>Tidak perlu sortir ribuan pelamar. AI memberikan skor dan peringkat kecocokan.</p>
            </div>
          </div>
        </div>

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
                <div className="w-32 h-32 rounded-full mb-6 flex items-center justify-center text-3xl font-black border-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(248,198,98,0.3)]" style={{ background: theme.card, borderColor: theme.border, color: theme.rekColor }}>
                  {founder.initials}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{founder.name}</h4>
                <p className="text-sm font-medium" style={{ color: theme.rekColor }}>{founder.role}</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-10 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-6" style={{ borderColor: theme.border, color: theme.muted }}>
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover bg-white/5 p-0.5" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}/>
            <div className="hidden w-8 h-8 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-sm">R</div>
            <span className="font-bold text-white">RekrutRek</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Capstone Project. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// ==========================================
// 2. KOMPONEN AUTHENTICATION
// ==========================================
function AuthPage({ isLogin }) {
  const navigate = useNavigate();
  const { roleId } = useParams(); 
  
  const role = roleConfig[roleId];
  if (!role) return <div className="p-10 text-center">Role tidak valid. <Link to="/">Kembali</Link></div>;

  const [formData, setFormData] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Pisahkan email dan password dari input form lainnya
    const { email, password, confirmPassword, ...otherData } = formData;

    try {
      if (isLogin) {
        // --- 1. PROSES LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;

      } else {
        // --- 2. PROSES REGISTER ---
        if (roleId === 'jobseeker' && password !== confirmPassword) {
          alert("Konfirmasi password tidak cocok!");
          return;
        }

        // Langkah A: Buat akun di Auth Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (authError) throw authError;

        // Langkah B: Masukkan data tambahan ke tabel public yang sesuai
        if (authData.user) {
          const userId = authData.user.id;
          let tableName = '';
          let insertPayload = {};

          // Sesuaikan payload dengan role masing-masing
          if (roleId === 'jobseeker') {
            tableName = 'profiles'; // Ganti jika nama tabelmu beda
            insertPayload = {
              user_id: userId, // Hubungkan dengan ID dari auth.users
              full_name: otherData.nama,
              email: email
            };
          } else if (roleId === 'umkm') {
            tableName = 'umkm_profiles'; // Ganti jika nama tabelmu beda
            insertPayload = {
              id: userId,
              nama_pic: otherData.namaPic,
              nama_umkm: otherData.namaUmkm,
              whatsapp: otherData.whatsapp,
              email: email
            };
          } else if (roleId === 'corporate') {
            tableName = 'corporate_profiles'; // Ganti jika nama tabelmu beda
            insertPayload = {
              id: userId,
              nama_pic_hr: otherData.namaPicHr,
              nama_perusahaan: otherData.namaPerusahaan,
              whatsapp: otherData.whatsapp,
              email: email
            };
          }

          // Eksekusi insert ke tabel
          const { error: dbError } = await supabase.from(tableName).insert([insertPayload]);
          
          if (dbError) {
            console.error("Gagal menyimpan profil:", dbError);
            throw new Error("Akun terbuat, tapi gagal menyimpan data profil.");
          }
        }
      }

      // --- 3. JIKA SUKSES, ARAHKAN KE DASHBOARD ---
      setIsSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard/${roleId}`);
      }, 1500);

    } catch (error) {
      alert(`Terjadi kesalahan: ${error.message}`);
      console.error(error);
    }
  };

  const toggleAuthMode = () => {
    if (isLogin) navigate(`/register/${roleId}`);
    else navigate(`/login/${roleId}`);
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-[#F8C662] selection:text-[#2C263F]">
      <div className="hidden lg:flex lg:w-5/12 text-white p-12 flex-col justify-between relative overflow-hidden" style={{ background: theme.appBg }}>
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-50 pointer-events-none" style={{ background: role.color }} />
        
        <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-white/5 p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">R</div>
          <h1 className="text-xl font-bold tracking-tight">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
        </div>

        <div className="relative z-10 my-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 border-2" style={{ background: role.color + '30', borderColor: role.color, color: role.color }}>
            {role.icon}
          </div>
          <h2 className="text-5xl font-black leading-[1.15] mb-6">
            Portal <br /> <span style={{ color: theme.rekColor }}>{role.title}</span>.
          </h2>
          <p className="text-lg text-white/70 max-w-sm leading-relaxed">
            {isLogin ? role.loginDesc : role.registerDesc}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-7/12 bg-[#FDFBF7] overflow-y-auto relative">
        <div className="min-h-full flex flex-col p-6 sm:p-12 lg:px-24">
          <div className="mb-12">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-bold text-[#2C263F]/60 hover:text-[#2C263F] transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Utama
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto pb-12">
            <div className="flex lg:hidden items-center gap-3 mb-10">
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-[#2C263F]/5 p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">R</div>
              <h1 className="text-2xl font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">{isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}</h2>
              <p className="text-[#2C263F]/60 text-sm flex items-center gap-2">
                Sebagai <span className="font-bold px-2 py-1 rounded text-white text-xs" style={{ background: role.color }}>{role.title}</span>
              </p>
            </div>

            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex flex-col items-center text-center">
                <CheckCircle className="w-12 h-12 mb-3 text-green-500" />
                <h3 className="font-bold text-lg mb-1">Berhasil!</h3>
                <p className="text-sm opacity-80">Mengarahkan ke Dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!isLogin && roleId === 'jobseeker' && (
                  <InputField label="Nama Lengkap" name="nama" icon={<User className="w-5 h-5" />} onChange={handleInputChange} />
                )}
                {!isLogin && roleId === 'umkm' && (
                  <>
                    <InputField label="Nama PIC" name="namaPic" icon={<User className="w-5 h-5" />} onChange={handleInputChange} />
                    <InputField label="Nama UMKM" name="namaUmkm" icon={<Store className="w-5 h-5" />} onChange={handleInputChange} />
                    <InputField label="Nomor WhatsApp" name="whatsapp" type="tel" icon={<Phone className="w-5 h-5" />} onChange={handleInputChange} />
                  </>
                )}
                {!isLogin && roleId === 'corporate' && (
                  <>
                    <InputField label="Nama PIC HR" name="namaPicHr" icon={<User className="w-5 h-5" />} onChange={handleInputChange} />
                    <InputField label="Nama Perusahaan" name="namaPerusahaan" icon={<Building2 className="w-5 h-5" />} onChange={handleInputChange} />
                    <InputField label="Nomor WhatsApp PIC" name="whatsapp" type="tel" icon={<Phone className="w-5 h-5" />} onChange={handleInputChange} />
                  </>
                )}
                <InputField label={!isLogin && roleId === 'corporate' ? "Email Perusahaan" : "Email"} name="email" type="email" icon={<Mail className="w-5 h-5" />} onChange={handleInputChange} />
                <div className="relative">
                  <InputField label="Password" name="password" type="password" icon={<Lock className="w-5 h-5" />} onChange={handleInputChange} />
                  {isLogin && (
                    <div className="absolute -bottom-6 right-0">
                      <a href="#" className="text-xs font-bold hover:underline transition-colors" style={{ color: role.color }}>Lupa password?</a>
                    </div>
                  )}
                </div>
                {!isLogin && roleId === 'jobseeker' && (
                  <InputField label="Konfirmasi Password" name="confirmPassword" type="password" icon={<Lock className="w-5 h-5" />} onChange={handleInputChange} />
                )}

                <button type="submit" className="w-full mt-8 py-4 rounded-xl font-bold text-white transition-transform hover:-translate-y-1" style={{ background: `linear-gradient(135deg, ${role.color}, #15121F)`, boxShadow: `0 10px 20px ${role.color}30` }}>
                  {isLogin ? 'Masuk' : 'Daftar'}
                </button>
                
                <div className="text-center mt-4 text-sm text-[#2C263F]/60 font-medium">
                  {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                  <button type="button" onClick={toggleAuthMode} className="font-bold hover:underline" style={{ color: role.color }}>
                    {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, type = "text", icon, onChange, defaultValue, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40">{icon}</div>
        <input 
          type={type} 
          name={name} 
          defaultValue={defaultValue} 
          placeholder={placeholder || `Masukkan ${label.toLowerCase()}`} 
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-[#2C263F]/10 text-[#2C263F] placeholder-[#2C263F]/30 focus:outline-none focus:border-[#F8C662] focus:ring-1 focus:ring-[#F8C662] transition-all" 
          required 
          onChange={onChange} 
        />
      </div>
    </div>
  );
}

// ==========================================
// 3. KOMPONEN GLOBAL: MODAL NOTIFIKASI
// ==========================================
function NotificationModal({ notif, onClose }) {
  if (!notif) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C263F]/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
        <div className="px-6 py-4 border-b border-[#2C263F]/10 flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.bgClass} ${notif.textClass}`}>
              {notif.icon}
            </div>
            <h3 className="font-bold text-lg text-[#2C263F]">Detail Pesan</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#2C263F]/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-[#2C263F]/60" />
          </button>
        </div>
        <div className="p-6">
          <h4 className="text-xl font-black text-[#2C263F] mb-2">{notif.title}</h4>
          <span className="text-xs font-bold text-[#2C263F]/40 block mb-4">{notif.time}</span>
          
          <div className="bg-[#FDFBF7] border border-[#2C263F]/10 rounded-xl p-4 mb-6">
            <p className="text-sm text-[#2C263F]/80 leading-relaxed" dangerouslySetInnerHTML={{__html: notif.desc}}></p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold border border-[#2C263F]/20 text-[#2C263F]/70 hover:bg-[#2C263F]/5 transition-colors">Tutup</button>
            <button onClick={() => { alert('Tindakan diproses oleh sistem!'); onClose(); }} className={`flex-1 py-3 rounded-xl font-bold text-white transition-transform hover:-translate-y-1 ${notif.actionBgClass || 'bg-[#41644A]'}`}>
              {notif.actionLabel || 'Tindak Lanjuti'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. KOMPONEN DASHBOARD PELAMAR (JOBSEEKER)
// ==========================================
// KOMPONEN MODAL: AI Matchmaking
function JobApplyModal({ job, onClose }) {
  const [step, setStep] = useState('form'); 
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [expectedSalary, setExpectedSalary] = useState('');

  const umkmSkills = ["Kasir", "Excel", "Komunikasi", "Customer Service", "Disiplin", "Bawa Motor"];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleProcess = () => {
    setStep('analyzing');
    setTimeout(() => setStep('result'), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C263F]/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-[#2C263F]/10 flex items-center justify-between bg-[#FDFBF7] shrink-0">
          <div>
            <h3 className="font-bold text-lg text-[#2C263F] flex items-center gap-2">
              {job.type === 'umkm' ? 'Tertarik dengan UMKM' : 'Apply Corporate'}
            </h3>
            <p className="text-sm text-[#2C263F]/60">{job.title} - {job.company}</p>
          </div>
          {step !== 'analyzing' && (
            <button onClick={onClose} className="p-2 hover:bg-[#2C263F]/5 rounded-full transition-colors">
              <X className="w-5 h-5 text-[#2C263F]/60" />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto">
          {step === 'form' && (
            <div className="flex flex-col gap-6">
              {job.type === 'umkm' ? (
                <>
                  <div className="bg-[#41644A]/10 border border-[#41644A]/20 p-4 rounded-xl flex gap-3">
                    <Sparkles className="w-5 h-5 text-[#41644A] shrink-0" />
                    <p className="text-sm text-[#2C263F] font-medium">Sistem kami menggunakan <b>Mutual Match</b>. Isi skill dan ekspektasi gaji Anda di bawah. Jika UMKM cocok, kontak akan saling dibagikan.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-3 uppercase tracking-wide">Pilih Skill yang Kamu Kuasai</label>
                    <div className="flex flex-wrap gap-2">
                      {umkmSkills.map((skill) => (
                        <button key={skill} onClick={() => toggleSkill(skill)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${selectedSkills.includes(skill) ? 'bg-[#41644A] text-white border-[#41644A]' : 'bg-white text-[#2C263F]/70 border-[#2C263F]/20 hover:border-[#41644A]/50'}`}>
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide">Expected Salary (Gaji yang Diharapkan)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/50 font-bold">Rp</div>
                      <input type="number" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} placeholder="Contoh: 2500000" className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#41644A] focus:ring-1 focus:ring-[#41644A] transition-all font-bold" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#595082]/10 border border-[#595082]/20 p-4 rounded-xl flex gap-3">
                    <Cpu className="w-5 h-5 text-[#595082] shrink-0" />
                    <p className="text-sm text-[#2C263F] font-medium">AI akan mengekstrak CV Anda otomatis untuk mencocokkan kualifikasi dengan posisi <b>{job.title}</b>.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-2 uppercase tracking-wide">Upload CV Terbaru (PDF)</label>
                    <div className="border-2 border-dashed border-[#595082]/30 rounded-2xl p-10 flex flex-col items-center justify-center bg-[#FDFBF7] hover:bg-[#595082]/5 cursor-pointer transition-colors group">
                      <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-[#595082]/10"><UploadCloud className="w-7 h-7 text-[#595082]" /></div>
                      <p className="text-base font-bold text-[#2C263F]">Klik untuk memilih file CV</p>
                      <p className="text-xs text-[#2C263F]/50 mt-1">Maksimal ukuran file 5MB</p>
                    </div>
                  </div>
                </>
              )}
              <button onClick={handleProcess} disabled={job.type === 'umkm' ? (selectedSkills.length === 0 || !expectedSalary) : false}
                className={`w-full py-4 rounded-xl font-bold text-white transition-transform hover:-translate-y-1 shadow-lg mt-2 ${job.type === 'umkm' ? 'bg-[#41644A] disabled:bg-gray-300' : 'bg-[#595082]'}`}>
                {job.type === 'umkm' ? 'Submit & Cek Kecocokan AI' : 'Upload & Ekstrak CV'}
              </button>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${job.type === 'umkm' ? 'bg-[#41644A]/10 text-[#41644A]' : 'bg-[#595082]/10 text-[#595082]'}`}><Loader2 className="w-10 h-10 animate-spin" /></div>
                <div className="absolute inset-0 rounded-full animate-ping border-4 border-current opacity-20" style={{ color: job.type === 'umkm' ? '#41644A' : '#595082' }}></div>
              </div>
              <h3 className="text-xl font-black text-[#2C263F] mb-2">{job.type === 'umkm' ? 'AI Sedang Menghitung...' : 'AI Mengekstrak CV...'}</h3>
              <p className="text-[#2C263F]/60 text-sm max-w-[250px]">{job.type === 'umkm' ? 'Mengolah data skill, jarak lokasi, dan ekspektasi gaji Anda.' : 'Membaca pengalaman, skill, dan pendidikan dari dokumen Anda.'}</p>
            </div>
          )}

          {step === 'result' && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"><CheckCircle className="w-10 h-10 text-green-500" /></div>
              <h3 className="text-2xl font-black text-[#2C263F] mb-2">Berhasil Terkirim!</h3>
              <div className="bg-[#FDFBF7] border border-[#2C263F]/10 rounded-xl p-4 mb-6 w-full">
                <p className="text-xs font-bold text-[#2C263F]/50 uppercase mb-1">Hasil Analisis AI</p>
                <p className="text-3xl font-black text-[#41644A]">Skor: 94%</p>
                <p className="text-sm text-[#2C263F]/70 mt-2">{job.type === 'umkm' ? 'Profil Anda sangat cocok! Menunggu pihak UMKM melakukan review.' : 'CV berhasil diekstrak dan masuk ke dalam top ranking pelamar.'}</p>
              </div>
              <button onClick={onClose} className="w-full py-4 rounded-xl font-bold text-[#2C263F] bg-[#F8C662] hover:bg-[#e5b658] transition-colors">Tutup & Kembali</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobseekerDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null); 
  const [appFilter, setAppFilter] = useState('all'); 

  const aiRecommendations = [
    { id: 1, role: "Barista & Kasir", company: "Kopi Kenangan Senja", type: "umkm", salary: "Rp 2.5 Jt - 3 Jt", distance: "1.2 km", match: 95, icon: <Store className="w-5 h-5"/> },
    { id: 2, role: "Admin Gudang", company: "Toko Sembako Maju", type: "umkm", salary: "Rp 2 Jt - 2.5 Jt", distance: "3.5 km", match: 88, icon: <Store className="w-5 h-5"/> },
    { id: 3, role: "Junior Frontend Dev", company: "PT Rekrut Teknologi", type: "corporate", salary: "Rp 6 Jt - 8 Jt", distance: "12 km", match: 92, icon: <Building2 className="w-5 h-5"/> },
  ];

  const jobseekerNotifs = [
    { id: 1, title: 'UMKM Bahagia Tertarik!', desc: 'Profilmu sangat cocok untuk posisi <b>Kasir Toko</b> (Match 95%).<br/><br/>Pihak UMKM telah mereview profilmu dan ingin melanjutkan ke tahap selanjutnya. Apakah kamu bersedia membagikan kontak WhatsApp?', time: '2 jam yang lalu', type: 'match', icon: <HeartHandshake className="w-6 h-6" />, bgClass: 'bg-red-50', textClass: 'text-red-500', actionLabel: 'Bagikan Kontak', actionBgClass: 'bg-red-500' },
    { id: 2, title: 'Jadwal Interview Corporate', desc: '<b>PT Rekrut Teknologi</b> menjadwalkan interview untuk posisi Junior Frontend Dev.<br/><br/>Jadwal: <b>Besok pukul 09:00 WIB</b><br/>Via: Google Meet<br/><br/>Harap konfirmasi kehadiran Anda melalui tombol di bawah ini.', time: '1 hari yang lalu', type: 'interview', icon: <Video className="w-6 h-6" />, bgClass: 'bg-purple-50', textClass: 'text-purple-500', actionLabel: 'Konfirmasi Hadir', actionBgClass: 'bg-[#595082]' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col md:flex-row selection:bg-[#F8C662] selection:text-[#2C263F]">
      <aside className="hidden md:flex w-72 flex-col justify-between border-r border-[#2C263F]/10 bg-white/50 backdrop-blur-xl sticky top-0 h-screen p-6">
        <div>
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-[#2C263F]/5 p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">R</div>
            <h1 className="text-2xl font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
          </div>
          <nav className="flex flex-col gap-2">
            <MenuButton icon={<Home />} label="Home" isActive={activeMenu === 'home'} onClick={() => setActiveMenu('home')} />
            <MenuButton icon={<Search />} label="Cari Lowongan" isActive={activeMenu === 'search'} onClick={() => setActiveMenu('search')} />
            <MenuButton icon={<FileText />} label="Lamaran Saya" badge="2" isActive={activeMenu === 'applications'} onClick={() => setActiveMenu('applications')} />
            <MenuButton icon={<Bell />} label="Notifikasi" badge="1" isActive={activeMenu === 'notifications'} onClick={() => setActiveMenu('notifications')} />
            <MenuButton icon={<User />} label="Profil Saya" isActive={activeMenu === 'profile'} onClick={() => setActiveMenu('profile')} />
          </nav>
        </div>
        <div className="mt-auto">
          <div className="p-4 rounded-2xl bg-[#41644A]/10 border border-[#41644A]/20 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#41644A] text-[#F8C662] flex items-center justify-center font-bold">AB</div>
            <div>
              <p className="text-sm font-bold text-[#2C263F]">Ahmad Budi</p>
              <p className="text-xs text-[#2C263F]/60">Pelamar Aktif</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 rounded-xl text-[#2C263F]/60 hover:text-red-500 hover:bg-red-50 transition-colors font-medium text-sm">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#2C263F]/10 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover bg-[#2C263F]/5 p-0.5" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          <div className="hidden w-8 h-8 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-sm">R</div>
          <h1 className="text-lg font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#41644A] text-[#F8C662] flex items-center justify-center font-bold text-sm">AB</div>
      </header>

      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12 relative">
        
        {/* MODALS */}
        {selectedJob && <JobApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        <NotificationModal notif={selectedNotif} onClose={() => setSelectedNotif(null)} />

        {activeMenu === 'home' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Halo, Ahmad! 👋</h2>
              <p className="text-[#2C263F]/60">Berikut adalah rekomendasi lowongan berdasarkan skill dan lokasimu.</p>
            </header>

            <div className="bg-gradient-to-r from-[#2C263F] to-[#595082] rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#F8C662]" /> Lengkapi Profilmu</h3>
                <p className="text-white/80 text-sm max-w-md">Tingkatkan peluang dipanggil wawancara hingga 80% dengan mengunggah foto, CV, dan mengatur lokasi GPS kamu.</p>
              </div>
              <button onClick={() => setActiveMenu('profile')} className="relative z-10 whitespace-nowrap bg-[#F8C662] text-[#2C263F] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
                Lengkapi Sekarang
              </button>
            </div>

            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-[#41644A]" /> Rekomendasi AI Match
                </h3>
                <button className="text-sm font-bold text-[#41644A] hover:underline">Lihat Semua</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {aiRecommendations.map((job) => (
                  <div key={job.id} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 hover:shadow-xl hover:border-[#41644A]/30 transition-all group cursor-pointer flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] text-[#2C263F] flex items-center justify-center border border-[#2C263F]/10">
                            {job.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#2C263F] group-hover:text-[#41644A] transition-colors">{job.role}</h4>
                            <p className="text-sm text-[#2C263F]/60 font-medium">{job.company}</p>
                          </div>
                        </div>
                        {job.type === 'umkm' ? (
                          <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-[10px] font-black border border-green-200">🟢 UMKM</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-[10px] font-black border border-purple-200">🟣 CORP</span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.distance}
                        </span>
                        <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> {job.salary}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#2C263F]/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${job.type === 'umkm' ? 'bg-[#41644A]/10 text-[#41644A]' : 'bg-[#595082]/10 text-[#595082]'}`}>
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-[#2C263F]/50 font-bold uppercase tracking-wide">AI Score</p>
                          <p className={`text-sm font-black ${job.type === 'umkm' ? 'text-[#41644A]' : 'text-[#595082]'}`}>{job.match}% Cocok</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedJob(job)} className={`px-4 py-2 text-white rounded-lg text-sm font-bold shadow-md transition-transform hover:-translate-y-0.5 ${job.type === 'umkm' ? 'bg-[#41644A]' : 'bg-[#595082]'}`}>
                        {job.type === 'umkm' ? 'Detail & Tertarik' : 'Detail & Lamar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'search' && (() => {
          const searchJobs = [
            { id: 101, title: "Kasir Toko Sembako", company: "UMKM Bahagia", type: "umkm", salary: "Rp 2 Jt - 2.5 Jt", location: "1.2 km", match: 96, top: "30%", left: "60%", icon: <Store className="w-5 h-5"/> },
            { id: 102, title: "Barista Part-time", company: "Kopi Kenangan Senja", type: "umkm", salary: "Rp 2.5 Jt - 3 Jt", location: "0.8 km", match: 95, top: "60%", left: "30%", icon: <Store className="w-5 h-5"/> },
            { id: 103, title: "Admin Social Media", company: "Toko Hijab Naila", type: "umkm", salary: "Rp 3 Jt - 3.5 Jt", location: "2.5 km", match: 88, top: "20%", left: "20%", icon: <Store className="w-5 h-5"/> },
            { id: 104, title: "Frontend Developer", company: "PT Rekrut Teknologi", type: "corporate", salary: "Rp 6 Jt - 8 Jt", location: "Jakarta Selatan", match: 92, icon: <Building2 className="w-5 h-5"/> },
            { id: 105, title: "Digital Marketing Specialist", company: "Corporate Group", type: "corporate", salary: "Rp 7 Jt - 10 Jt", location: "Jakarta Pusat", match: 85, icon: <Building2 className="w-5 h-5"/> },
          ];

          const filteredJobs = searchJobs.filter(job =>
            (searchFilter === 'all' || job.type === searchFilter) &&
            (job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          return (
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <header className="mb-8">
                <h2 className="text-3xl font-black text-[#2C263F] mb-2">Cari Lowongan 🔍</h2>
                <p className="text-[#2C263F]/60">Temukan pekerjaan impianmu di sekitar rumah atau di perusahaan idaman.</p>
              </header>

              <div className="bg-white border border-[#2C263F]/10 p-4 rounded-3xl mb-8 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C263F]/40" />
                  <input type="text" placeholder="Cari posisi, skill, atau perusahaan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FDFBF7] border-none focus:outline-none focus:ring-2 focus:ring-[#F8C662] text-[#2C263F] transition-all" />
                </div>
                <div className="flex gap-2 bg-[#FDFBF7] p-1.5 rounded-2xl overflow-x-auto hide-scrollbar">
                  <button onClick={() => setSearchFilter('all')} className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-colors ${searchFilter === 'all' ? 'bg-[#2C263F] text-white shadow-md' : 'text-[#2C263F]/60 hover:bg-[#2C263F]/5'}`}>Semua</button>
                  <button onClick={() => setSearchFilter('umkm')} className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-colors ${searchFilter === 'umkm' ? 'bg-[#41644A] text-white shadow-md' : 'text-[#41644A]/70 hover:bg-[#41644A]/10'}`}>UMKM Terdekat</button>
                  <button onClick={() => setSearchFilter('corporate')} className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-colors ${searchFilter === 'corporate' ? 'bg-[#595082] text-white shadow-md' : 'text-[#595082]/70 hover:bg-[#595082]/10'}`}>Corporate</button>
                </div>
              </div>

              {searchFilter === 'umkm' && (
                <div className="mb-8 p-1.5 bg-white border border-[#2C263F]/10 rounded-[28px] shadow-sm animate-in zoom-in-95 duration-300">
                  <div className="w-full h-[350px] bg-[#EAEADD] rounded-[22px] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#41644A 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full absolute -top-3 -left-3 animate-ping"></div>
                        <div className="w-6 h-6 bg-blue-600 border-2 border-white rounded-full shadow-lg relative z-10 flex items-center justify-center"><User className="w-3 h-3 text-white" /></div>
                      </div>
                      <div className="mt-2 bg-white px-3 py-1 rounded-xl text-[10px] font-black shadow-md border border-[#2C263F]/10 text-[#2C263F] flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /> Lokasi Kamu</div>
                    </div>
                    {filteredJobs.filter(j => j.type === 'umkm').map(job => (
                      <div key={job.id} className="absolute flex flex-col items-center cursor-pointer transition-transform hover:scale-110 group z-10" style={{ top: job.top, left: job.left }}>
                        <MapPin className="w-8 h-8 text-red-500 drop-shadow-md group-hover:-translate-y-2 transition-transform" fill="#FDFBF7" />
                        <div className="mt-1 bg-white px-2 py-1.5 rounded-xl text-[10px] font-bold shadow-lg border border-[#2C263F]/10 flex flex-col items-center text-[#2C263F] min-w-[100px] text-center opacity-0 group-hover:opacity-100 transition-opacity absolute top-8">
                          <span className="text-[#41644A] truncate w-full">{job.company}</span>
                          <span className="text-red-500">{job.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 hover:shadow-xl hover:border-[#F8C662]/50 transition-all group cursor-pointer flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] text-[#2C263F] flex items-center justify-center border border-[#2C263F]/10">{job.icon}</div>
                          <div>
                            <h4 className="font-bold text-lg text-[#2C263F] group-hover:text-[#F8C662] transition-colors">{job.title}</h4>
                            <p className="text-sm text-[#2C263F]/60 font-medium">{job.company}</p>
                          </div>
                        </div>
                        {job.type === 'umkm' ? <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-[10px] font-black border border-green-200">🟢 UMKM</span> : <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-[10px] font-black border border-purple-200">🟣 CORP</span>}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1.5 bg-[#FDFBF7] border border-[#2C263F]/5 text-[#2C263F]/70 rounded-xl text-xs font-bold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="px-3 py-1.5 bg-[#FDFBF7] border border-[#2C263F]/5 text-[#2C263F]/70 rounded-xl text-xs font-bold flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[#2C263F]/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${job.type === 'umkm' ? 'bg-[#41644A]/10 text-[#41644A]' : 'bg-[#595082]/10 text-[#595082]'}`}><Target className="w-4 h-4" /></div>
                        <div><p className="text-[10px] text-[#2C263F]/50 font-bold uppercase tracking-wide">AI Score</p><p className={`text-sm font-black ${job.type === 'umkm' ? 'text-[#41644A]' : 'text-[#595082]'}`}>{job.match}% Cocok</p></div>
                      </div>
                      <button onClick={() => setSelectedJob(job)} className={`px-6 py-2.5 text-white rounded-xl text-sm font-bold shadow-md transition-transform hover:-translate-y-0.5 ${job.type === 'umkm' ? 'bg-[#41644A]' : 'bg-[#595082]'}`}>
                        {job.type === 'umkm' ? 'Detail & Tertarik' : 'Detail & Lamar'}
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-1 md:col-span-2 text-center py-20 bg-white border border-[#2C263F]/10 rounded-3xl"><Search className="w-12 h-12 text-[#2C263F]/20 mx-auto mb-4" /><h3 className="text-xl font-bold text-[#2C263F]">Pencarian Tidak Ditemukan</h3><p className="text-sm text-[#2C263F]/50 mt-2">Coba gunakan kata kunci atau filter lain.</p></div>
                )}
              </div>
            </div>
          );
        })()}

        {activeMenu === 'profile' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Profil Saya 👤</h2>
              <p className="text-[#2C263F]/60">Lengkapi profil untuk meningkatkan peluang match dengan pekerjaan impian.</p>
            </header>
            
            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-[#41644A]/10 border-4 border-white shadow-lg flex items-center justify-center text-[#41644A] relative">
                    <User className="w-12 h-12" />
                    <button className="absolute bottom-0 right-0 p-2 bg-[#F8C662] rounded-full shadow-md text-[#2C263F] hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-[#2C263F]">Ahmad Budi</h3>
                    <p className="text-xs text-[#2C263F]/50">Pelamar Aktif</p>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-5">
                  <InputField label="Nama Lengkap" name="nama" icon={<User className="w-5 h-5"/>} defaultValue="Ahmad Budi" />
                  <InputField label="Email" name="email" type="email" icon={<Mail className="w-5 h-5"/>} defaultValue="ahmad.budi@email.com" />
                  <InputField label="Alamat Domisili" name="alamat" icon={<MapPin className="w-5 h-5"/>} defaultValue="Jl. Sudirman No. 123, Jakarta" />
                  
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Curriculum Vitae (CV)</label>
                    <div className="border-2 border-dashed border-[#2C263F]/20 rounded-2xl p-6 flex flex-col items-center justify-center bg-[#FDFBF7] hover:bg-[#2C263F]/5 cursor-pointer transition-colors group">
                      <UploadCloud className="w-8 h-8 text-[#41644A] mb-2 group-hover:-translate-y-1 transition-transform" />
                      <p className="text-sm font-bold text-[#2C263F]">Klik untuk unggah CV terbaru</p>
                      <p className="text-xs text-[#2C263F]/50">PDF maksimal 5MB. AI akan otomatis mengekstrak skill Anda.</p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="px-8 py-3.5 bg-[#41644A] text-white rounded-xl font-bold shadow-md hover:bg-[#213722] transition-colors">Simpan Perubahan</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'notifications' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Notifikasi 🔔</h2>
              <p className="text-[#2C263F]/60">Pembaruan terbaru tentang lamaran dan akunmu.</p>
            </header>

            <div className="flex flex-col gap-4">
              {jobseekerNotifs.map((notif) => (
                <div key={notif.id} onClick={() => setSelectedNotif(notif)} className={`bg-white border-2 border-[#2C263F]/5 rounded-2xl p-5 flex gap-4 hover:shadow-md hover:border-[#2C263F]/20 transition-all cursor-pointer`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.bgClass} ${notif.textClass}`}>
                    {notif.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#2C263F] text-lg">{notif.title}</h4>
                      <div className={`w-2 h-2 rounded-full ${notif.type === 'match' ? 'bg-red-500' : 'bg-purple-500'} mt-2`}></div>
                    </div>
                    <p className="text-sm text-[#2C263F]/70 line-clamp-2" dangerouslySetInnerHTML={{__html: notif.desc}}></p>
                    <span className="text-xs font-bold text-[#2C263F]/40 mt-3 block">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'applications' && (() => {
          const myApplications = [
            { id: 201, title: "Kasir Toko Sembako", company: "UMKM Bahagia", type: "umkm", status: "UMKM Tertarik", date: "2 hari yang lalu", score: 96, icon: <Store className="w-5 h-5"/>, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
            { id: 202, title: "Frontend Developer", company: "PT Rekrut Teknologi", type: "corporate", status: "Jadwal Interview", date: "5 hari yang lalu", score: 92, icon: <Building2 className="w-5 h-5"/>, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
            { id: 203, title: "Barista Part-time", company: "Kopi Kenangan Senja", type: "umkm", status: "Menunggu Review", date: "1 minggu yang lalu", score: 95, icon: <Store className="w-5 h-5"/>, color: "text-[#2C263F]/60", bg: "bg-[#2C263F]/5", border: "border-[#2C263F]/10" },
          ];

          const filteredApps = appFilter === 'all' ? myApplications : myApplications.filter(app => app.status === appFilter);

          return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <header className="mb-8">
                <h2 className="text-3xl font-black text-[#2C263F] mb-2">Lamaran Saya 📄</h2>
                <p className="text-[#2C263F]/60">Pantau status lamaran kerja Anda di UMKM maupun Corporate.</p>
              </header>

              <div className="flex gap-2 bg-white border border-[#2C263F]/10 p-2 rounded-2xl mb-8 overflow-x-auto hide-scrollbar shadow-sm">
                  <button onClick={() => setAppFilter('all')} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${appFilter === 'all' ? 'bg-[#2C263F] text-white shadow-md' : 'text-[#2C263F]/60 hover:bg-[#2C263F]/5'}`}>Semua</button>
                  <button onClick={() => setAppFilter('Menunggu Review')} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${appFilter === 'Menunggu Review' ? 'bg-[#41644A] text-white shadow-md' : 'text-[#41644A]/70 hover:bg-[#41644A]/10'}`}>Menunggu Review</button>
                  <button onClick={() => setAppFilter('UMKM Tertarik')} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${appFilter === 'UMKM Tertarik' ? 'bg-red-500 text-white shadow-md' : 'text-red-500/70 hover:bg-red-50'}`}>UMKM Tertarik</button>
                  <button onClick={() => setAppFilter('Jadwal Interview')} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${appFilter === 'Jadwal Interview' ? 'bg-[#595082] text-white shadow-md' : 'text-[#595082]/70 hover:bg-[#595082]/10'}`}>Interview</button>
              </div>

              <div className="flex flex-col gap-4">
                {filteredApps.map((app) => (
                  <div key={app.id} className="bg-white border border-[#2C263F]/10 rounded-3xl p-5 md:p-6 hover:shadow-xl hover:border-[#F8C662]/50 transition-all group flex flex-col md:flex-row gap-5 md:items-center justify-between cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${app.type === 'umkm' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                        {app.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-[#2C263F] group-hover:text-[#F8C662] transition-colors">{app.title}</h4>
                          <span className="text-xs font-bold text-[#2C263F]/40">• {app.date}</span>
                        </div>
                        <p className="text-sm text-[#2C263F]/70 font-medium mb-4">{app.company}</p>
                        
                        <div className="flex flex-wrap gap-2">
                           <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${app.bg} ${app.color} ${app.border}`}>
                             Status: {app.status}
                           </span>
                           <span className="px-3 py-1.5 bg-[#FDFBF7] border border-[#2C263F]/10 rounded-xl text-xs font-bold text-[#41644A] flex items-center gap-1">
                             <Target className="w-3 h-3"/> AI Score: {app.score}%
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex w-full md:w-auto gap-2 mt-2 md:mt-0">
                       <button className="flex-1 md:flex-none px-6 py-3 bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] rounded-xl text-sm font-bold hover:bg-[#2C263F]/5 transition-colors">
                         Detail
                       </button>
                       {app.status === 'UMKM Tertarik' && (
                         <button className="flex-1 md:flex-none px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-bold shadow-md hover:bg-red-600 transition-colors">
                           Bagikan Kontak
                         </button>
                       )}
                       {app.status === 'Jadwal Interview' && (
                         <button className="flex-1 md:flex-none px-6 py-3 bg-[#595082] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#2C263F] transition-colors">
                           Cek Jadwal
                         </button>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      </main>

      {/* BOTTOM NAVIGATION (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#2C263F]/10 pb-safe z-30">
        <div className="flex items-center justify-around p-2">
          <MobileMenuButton icon={<Home />} label="Home" isActive={activeMenu === 'home'} onClick={() => setActiveMenu('home')} />
          <MobileMenuButton icon={<Search />} label="Cari" isActive={activeMenu === 'search'} onClick={() => setActiveMenu('search')} />
          <MobileMenuButton icon={<FileText />} label="Lamaran" isActive={activeMenu === 'applications'} onClick={() => setActiveMenu('applications')} />
          <MobileMenuButton icon={<Bell />} label="Notif" isActive={activeMenu === 'notifications'} onClick={() => setActiveMenu('notifications')} />
          <MobileMenuButton icon={<User />} label="Profil" isActive={activeMenu === 'profile'} onClick={() => setActiveMenu('profile')} />
        </div>
      </nav>

    </div>
  );
}

// ==========================================
// 4. KOMPONEN DASHBOARD UMKM
// ==========================================
function UmkmDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedNotif, setSelectedNotif] = useState(null); // State Notifikasi

  const stats = [
    { label: 'Lowongan Aktif', value: '7' },
    { label: 'Pelamar Masuk', value: '42' },
    { label: 'Match Tinggi', value: '18' },
  ];

  const candidates = [
    { id: 1, name: 'Naila Atha', role: 'Kasir', match: 95, distance: '1.2 km', salary: 'Rp 2.5 Jt' },
    { id: 2, name: 'Andi Pratama', role: 'Admin Toko', match: 91, distance: '2.4 km', salary: 'Rp 2.2 Jt' },
    { id: 3, name: 'Siti Rahma', role: 'Crew Store', match: 88, distance: '3.1 km', salary: 'Rp 2.3 Jt' },
  ];

  const jobs = [
    { id: 1, title: 'Kasir Toko', applicants: '12 Pelamar', status: 'Aktif' },
    { id: 2, title: 'Admin Gudang', applicants: '8 Pelamar', status: 'Aktif' },
    { id: 3, title: 'Crew Outlet', applicants: '5 Pelamar', status: 'Pending' },
  ];

  // Data Notifikasi UMKM
  const umkmNotifs = [
    { id: 1, title: 'Kandidat Baru Masuk!', desc: '<b>Naila Atha</b> (Match 95%) tertarik dengan lowongan <b>Kasir Toko</b> Anda.<br/><br/>Jarak kandidat hanya <b>1.2 km</b> dari lokasi Anda. Segera lakukan review profil dan klik tertarik agar sistem membagikan kontak WhatsApp pelamar kepada Anda.', time: '10 menit yang lalu', type: 'candidate', icon: <Users className="w-6 h-6" />, bgClass: 'bg-[#41644A]/10', textClass: 'text-[#41644A]', actionLabel: 'Review Kandidat', actionBgClass: 'bg-[#F8C662] text-[#2C263F]' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col md:flex-row selection:bg-[#F8C662] selection:text-[#2C263F]">
      <aside className="hidden md:flex w-72 flex-col justify-between border-r border-[#2C263F]/10 bg-white/50 backdrop-blur-xl sticky top-0 h-screen p-6">
        <div>
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-[#2C263F]/5 p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">R</div>
            <h1 className="text-2xl font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
          </div>

          <nav className="flex flex-col gap-2">
            <MenuButton icon={<Home />} label="Home" isActive={activeMenu === 'home'} onClick={() => setActiveMenu('home')} />
            <MenuButton icon={<Search />} label="Buat Lowongan" isActive={activeMenu === 'jobs'} onClick={() => setActiveMenu('jobs')} />
            <MenuButton icon={<FileText />} label="Kandidat" badge="4" isActive={activeMenu === 'candidates'} onClick={() => setActiveMenu('candidates')} />
            <MenuButton icon={<Bell />} label="Notifikasi" badge="2" isActive={activeMenu === 'notifications'} onClick={() => setActiveMenu('notifications')} />
            <MenuButton icon={<User />} label="Profil UMKM" isActive={activeMenu === 'profile'} onClick={() => setActiveMenu('profile')} />
          </nav>
        </div>

        <div className="mt-auto">
          <div className="p-4 rounded-2xl bg-[#F8C662]/10 border border-[#F8C662]/20 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#41644A] text-[#F8C662] flex items-center justify-center font-bold">UM</div>
            <div>
              <p className="text-sm font-bold text-[#2C263F]">UMKM Bahagia</p>
              <p className="text-xs text-[#2C263F]/60">Pemilik Aktif</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 rounded-xl text-[#2C263F]/60 hover:text-red-500 hover:bg-red-50 transition-colors font-medium text-sm">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#2C263F]/10 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover bg-[#2C263F]/5 p-0.5" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          <div className="hidden w-8 h-8 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-sm">R</div>
          <h1 className="text-lg font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#41644A] text-[#F8C662] flex items-center justify-center font-bold text-sm">UM</div>
      </header>

      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12 relative">
        <NotificationModal notif={selectedNotif} onClose={() => setSelectedNotif(null)} />

        {/* --- VIEW: HOME --- */}
        {activeMenu === 'home' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Halo, UMKM Bahagia 👋</h2>
              <p className="text-[#2C263F]/60">Kelola lowongan dan temukan kandidat terdekat yang paling cocok.</p>
            </header>

            <div className="bg-gradient-to-r from-[#2C263F] to-[#595082] rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F8C662]" /> Lengkapi Profil UMKM
                </h3>
                <p className="text-white/80 text-sm max-w-md">
                  Tambahkan lokasi usaha, kategori, dan kontak PIC agar kandidat mudah menemukan toko kamu.
                </p>
              </div>
              <button onClick={() => setActiveMenu('profile')} className="relative z-10 whitespace-nowrap bg-[#F8C662] text-[#2C263F] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
                Lengkapi Sekarang
              </button>
            </div>

            <div className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wide text-[#2C263F]/50 font-bold mb-2">{s.label}</p>
                    <h4 className="text-3xl font-black text-[#41644A]">{s.value}</h4>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2">
                  <Target className="w-6 h-6 text-[#41644A]" /> Kandidat Terbaik
                </h3>
                <button className="text-sm font-bold text-[#41644A] hover:underline">Lihat Semua</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {candidates.map((c) => (
                  <div key={c.id} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 hover:shadow-xl hover:border-[#41644A]/30 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-[#2C263F] group-hover:text-[#41644A] transition-colors">{c.name}</h4>
                        <p className="text-sm text-[#2C263F]/60 font-medium">{c.role}</p>
                      </div>
                      <button className="text-[#2C263F]/30 hover:text-[#F8C662] transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {c.distance}
                      </span>
                      <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {c.salary}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-[#2C263F]/10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#2C263F]/50 font-bold uppercase tracking-wide">Match Score</p>
                        <p className="text-sm font-black text-[#41644A]">{c.match}% Cocok</p>
                      </div>
                      <button className="px-4 py-2 bg-[#41644A] text-[#FDFBF7] rounded-lg text-sm font-bold shadow-md hover:bg-[#213722] transition-colors">
                        Lihat Profil
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2">
                  <Store className="w-6 h-6 text-[#41644A]" /> Lowongan Saya
                </h3>
                <button className="text-sm font-bold text-[#41644A] hover:underline">Tambah Lowongan</button>
              </div>

              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#2C263F]">{job.title}</h4>
                      <p className="text-sm text-[#2C263F]/60">{job.applicants}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      job.status === 'Aktif' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: BUAT LOWONGAN UMKM --- */}
        {activeMenu === 'jobs' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Buat Lowongan UMKM 📝</h2>
              <p className="text-[#2C263F]/60">Sistem AI akan otomatis mencocokkan lowongan ini dengan pelamar terdekat.</p>
            </header>

            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); alert('Lowongan berhasil dipublish! AI mulai mencari kandidat.'); setActiveMenu('home'); }} className="flex flex-col gap-5">
                <InputField label="Nama Posisi (Jabatan)" name="title" icon={<Briefcase className="w-5 h-5"/>} placeholder="Contoh: Kasir Toko, Barista, Staff Gudang" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Estimasi Gaji Bulanan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40"><DollarSign className="w-5 h-5"/></div>
                      <select className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] transition-all font-medium appearance-none">
                        <option value="">Pilih Range Gaji</option>
                        <option value="1">Di bawah Rp 1.500.000</option>
                        <option value="2">Rp 1.500.000 - Rp 2.500.000</option>
                        <option value="3">Rp 2.500.000 - Rp 3.500.000</option>
                        <option value="4">Di atas Rp 3.500.000</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Jadwal Kerja</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40"><Store className="w-5 h-5"/></div>
                      <select className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] transition-all font-medium appearance-none">
                        <option value="full">Full-time (Penuh Waktu)</option>
                        <option value="part">Part-time (Paruh Waktu)</option>
                        <option value="shift">Sistem Shift</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C263F] mb-2 uppercase tracking-wide opacity-80">Kebutuhan Skill Dasar (Pilih Maks 3)</label>
                  <div className="flex flex-wrap gap-2">
                    {["Kasir", "Excel Dasar", "Komunikasi Ramah", "Bongkar Muat", "Punya Motor", "SIM C", "Bisa Masak", "Jujur & Disiplin"].map((skill) => (
                      <label key={skill} className="cursor-pointer">
                        <input type="checkbox" className="peer hidden" />
                        <span className="px-4 py-2 rounded-xl text-sm font-bold border border-[#2C263F]/10 text-[#2C263F]/60 peer-checked:bg-[#41644A] peer-checked:text-white peer-checked:border-[#41644A] transition-all block hover:bg-black/5">
                          {skill}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-[#2C263F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[#2C263F]/50 max-w-sm">Lokasi lowongan otomatis mengikuti alamat profil UMKM Anda untuk fitur pencocokan jarak.</p>
                  <button type="submit" className="w-full sm:w-auto px-8 py-4 bg-[#41644A] text-white rounded-xl font-bold shadow-md hover:bg-[#213722] transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4"/> Publish ke Pelamar Sekitar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- VIEW: KANDIDAT UMKM --- */}
        {activeMenu === 'candidates' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Manajemen Kandidat 👥</h2>
              <p className="text-[#2C263F]/60">Daftar pelamar yang telah menunjukkan ketertarikan pada lowongan Anda.</p>
            </header>
            
            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 border-2 border-green-100">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-[#2C263F] mb-2">Semua Kandidat Telah Di-review!</h3>
                <p className="text-[#2C263F]/60 text-sm max-w-md">Kerja bagus! Anda sudah membalas semua pelamar yang masuk hari ini. Tunggu notifikasi selanjutnya jika ada *Mutual Match*.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: PROFILE UMKM --- */}
        {activeMenu === 'profile' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Profil UMKM 🏪</h2>
              <p className="text-[#2C263F]/60">Pastikan informasi alamat dan kontak benar agar pelamar mudah menemukan tokomu.</p>
            </header>
            
            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-2xl bg-[#F8C662]/10 border-4 border-white shadow-lg flex items-center justify-center text-[#F8C662] relative overflow-hidden">
                    <Store className="w-12 h-12 text-[#41644A]" />
                    <button className="absolute bottom-1 right-1 p-2 bg-[#41644A] rounded-full shadow-md text-white hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-[#2C263F]">UMKM Bahagia</h3>
                    <p className="text-xs text-[#2C263F]/50">Retail & Minimarket</p>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-5">
                  <InputField label="Nama Usaha (UMKM)" name="namaUsaha" icon={<Store className="w-5 h-5"/>} defaultValue="UMKM Bahagia Sejahtera" />
                  <InputField label="Kategori Bisnis" name="kategori" icon={<Target className="w-5 h-5"/>} defaultValue="Retail & Kelontong" />
                  <InputField label="Nama PIC / Pemilik" name="pic" icon={<User className="w-5 h-5"/>} defaultValue="Pak Budi" />
                  <InputField label="Nomor WhatsApp" name="wa" type="tel" icon={<Phone className="w-5 h-5"/>} defaultValue="081234567890" />
                  
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Alamat Lengkap Toko</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none text-[#2C263F]/40"><MapPin className="w-5 h-5"/></div>
                      <textarea rows="3" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] focus:ring-1 focus:ring-[#F8C662] transition-all" defaultValue="Jl. Merdeka No. 45, Kecamatan Sukamaju, Kota Sejahtera"></textarea>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="px-8 py-3.5 bg-[#41644A] text-white rounded-xl font-bold shadow-md hover:bg-[#213722] transition-colors">Simpan Profil</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: NOTIFICATIONS --- */}
        {activeMenu === 'notifications' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Notifikasi UMKM 🔔</h2>
              <p className="text-[#2C263F]/60">Informasi kandidat dan lamaran masuk terbaru.</p>
            </header>

            <div className="flex flex-col gap-4">
              {umkmNotifs.map((notif) => (
                <div key={notif.id} onClick={() => setSelectedNotif(notif)} className={`bg-white border-2 border-[#2C263F]/5 rounded-2xl p-5 flex gap-4 hover:shadow-md hover:border-[#2C263F]/20 transition-all cursor-pointer`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.bgClass} ${notif.textClass}`}>
                    {notif.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#2C263F] text-lg">{notif.title}</h4>
                      <div className={`w-2 h-2 rounded-full bg-[#41644A] mt-2`}></div>
                    </div>
                    <p className="text-sm text-[#2C263F]/70 line-clamp-2" dangerouslySetInnerHTML={{__html: notif.desc}}></p>
                    <span className="text-xs font-bold text-[#2C263F]/40 mt-3 block">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#2C263F]/10 pb-safe z-30">
        <div className="flex items-center justify-around p-2">
          <MobileMenuButton icon={<Home />} label="Home" isActive={activeMenu === 'home'} onClick={() => setActiveMenu('home')} />
          <MobileMenuButton icon={<Search />} label="Buat Lowongan" isActive={activeMenu === 'jobs'} onClick={() => setActiveMenu('jobs')} />
          <MobileMenuButton icon={<FileText />} label="Kandidat" isActive={activeMenu === 'candidates'} onClick={() => setActiveMenu('candidates')} />
          <MobileMenuButton icon={<Bell />} label="Notif" isActive={activeMenu === 'notifications'} onClick={() => setActiveMenu('notifications')} />
          <MobileMenuButton icon={<User />} label="Profil" isActive={activeMenu === 'profile'} onClick={() => setActiveMenu('profile')} />
        </div>
      </nav>
    </div>
  );
}

// ==========================================
// 5. KOMPONEN DASHBOARD CORPORATE
// ==========================================
function CorporateDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedNotif, setSelectedNotif] = useState(null); // State Notifikasi

  const stats = [
    { label: 'Lowongan Aktif', value: '5' },
    { label: 'Kandidat Tersaring', value: '120' },
    { label: 'Interview', value: '20' },
  ];

  const pipeline = [
    { stage: 'Applied', count: '120' },
    { stage: 'Screening', count: '60' },
    { stage: 'Interview', count: '20' },
    { stage: 'Accepted', count: '4' },
  ];

  const candidates = [
    { id: 1, name: 'Naila Atha', role: 'Frontend Dev', score: 96, status: 'AI Screening' },
    { id: 2, name: 'Andi Pratama', role: 'UI/UX Designer', score: 92, status: 'HR Review' },
    { id: 3, name: 'Siti Rahma', role: 'Data Analyst', score: 89, status: 'Interview' },
  ];

  // Data Notifikasi Corporate
  const corporateNotifs = [
    { id: 1, title: 'AI Screening Selesai', desc: 'AI telah selesai menyeleksi 150 CV untuk posisi <b>Frontend Developer</b>.<br/><br/>Ditemukan 20 kandidat dengan skor kecocokan tinggi (Shortlisted) di atas 85%. Silakan review kandidat tersebut untuk menjadwalkan interview.', time: '30 menit yang lalu', type: 'system', icon: <Cpu className="w-6 h-6" />, bgClass: 'bg-[#595082]/10', textClass: 'text-[#595082]', actionLabel: 'Lihat Hasil Screening', actionBgClass: 'bg-[#595082]' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col md:flex-row selection:bg-[#F8C662] selection:text-[#2C263F]">
      <aside className="hidden md:flex w-72 flex-col justify-between border-r border-[#2C263F]/10 bg-white/50 backdrop-blur-xl sticky top-0 h-screen p-6">
        <div>
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-[#2C263F]/5 p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">R</div>
            <h1 className="text-2xl font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
          </div>

          <nav className="flex flex-col gap-2">
            <MenuButton icon={<Home />} label="Home" isActive={activeMenu === 'home'} onClick={() => setActiveMenu('home')} />
            <MenuButton icon={<Search />} label="Lowongan" isActive={activeMenu === 'jobs'} onClick={() => setActiveMenu('jobs')} />
            <MenuButton icon={<Cpu />} label="AI Screening" badge="8" isActive={activeMenu === 'screening'} onClick={() => setActiveMenu('screening')} />
            <MenuButton icon={<Bell />} label="Notifikasi" badge="2" isActive={activeMenu === 'notifications'} onClick={() => setActiveMenu('notifications')} />
            <MenuButton icon={<User />} label="Profil Perusahaan" isActive={activeMenu === 'profile'} onClick={() => setActiveMenu('profile')} />
          </nav>
        </div>

        <div className="mt-auto">
          <div className="p-4 rounded-2xl bg-[#595082]/10 border border-[#595082]/20 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#595082] text-[#F8C662] flex items-center justify-center font-bold">CP</div>
            <div>
              <p className="text-sm font-bold text-[#2C263F]">PT Rekrut Teknologi</p>
              <p className="text-xs text-[#2C263F]/60">Corporate HR</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 rounded-xl text-[#2C263F]/60 hover:text-red-500 hover:bg-red-50 transition-colors font-medium text-sm">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#2C263F]/10 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover bg-[#2C263F]/5 p-0.5" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          <div className="hidden w-8 h-8 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-sm">R</div>
          <h1 className="text-lg font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#595082] text-[#F8C662] flex items-center justify-center font-bold text-sm">CP</div>
      </header>

      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12 relative">
        <NotificationModal notif={selectedNotif} onClose={() => setSelectedNotif(null)} />

        {/* --- VIEW: HOME --- */}
        {activeMenu === 'home' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Halo, PT Rekrut Teknologi 👋</h2>
              <p className="text-[#2C263F]/60">Pantau proses screening, ranking kandidat, dan pipeline rekrutmen perusahaanmu.</p>
            </header>

            <div className="bg-gradient-to-r from-[#2C263F] to-[#595082] rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#F8C662]" /> AI Screening Aktif
                </h3>
                <p className="text-white/80 text-sm max-w-md">
                  CV kandidat sedang diproses otomatis untuk menemukan kandidat terbaik sebelum interview.
                </p>
              </div>
              <button className="relative z-10 whitespace-nowrap bg-[#F8C662] text-[#2C263F] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
                Review Kandidat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {stats.map((s) => (
                <div key={s.label} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wide text-[#2C263F]/50 font-bold mb-2">{s.label}</p>
                  <h4 className="text-3xl font-black text-[#595082]">{s.value}</h4>
                </div>
              ))}
            </div>

            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#595082]" /> Kandidat Terbaik
                </h3>
                <button className="text-sm font-bold text-[#595082] hover:underline">Lihat Semua</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {candidates.map((c) => (
                  <div key={c.id} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 hover:shadow-xl hover:border-[#595082]/30 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-[#2C263F] group-hover:text-[#595082] transition-colors">{c.name}</h4>
                        <p className="text-sm text-[#2C263F]/60 font-medium">{c.role}</p>
                      </div>
                      <button className="text-[#2C263F]/30 hover:text-[#F8C662] transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1">
                        <Target className="w-3 h-3" /> {c.score}% Score
                      </span>
                      <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1">
                        <Bell className="w-3 h-3" /> {c.status}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-[#2C263F]/10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#2C263F]/50 font-bold uppercase tracking-wide">Rekomendasi AI</p>
                        <p className="text-sm font-black text-[#595082]">Sangat Cocok</p>
                      </div>
                      <button className="px-4 py-2 bg-[#595082] text-[#FDFBF7] rounded-lg text-sm font-bold shadow-md hover:bg-[#2C263F] transition-colors">
                        Buka CV
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#595082]" /> Pipeline Rekrutmen
                </h3>
                <button className="text-sm font-bold text-[#595082] hover:underline">Atur Tahap</button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {pipeline.map((p) => (
                  <div key={p.stage} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-[#2C263F]/50 font-bold mb-2">{p.stage}</p>
                    <h4 className="text-3xl font-black text-[#595082]">{p.count}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: BUAT LOWONGAN CORPORATE --- */}
        {activeMenu === 'jobs' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Posting Lowongan Profesional 📝</h2>
              <p className="text-[#2C263F]/60">Jabarkan kualifikasi dengan detail. AI akan menggunakannya untuk men-screening CV pelamar.</p>
            </header>

            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); alert('Lowongan berhasil diposting! AI Screening diaktifkan.'); setActiveMenu('home'); }} className="flex flex-col gap-5">
                <InputField label="Job Title" name="title" icon={<Briefcase className="w-5 h-5"/>} placeholder="e.g. Senior Frontend Developer" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Departemen" name="dept" icon={<Building2 className="w-5 h-5"/>} placeholder="e.g. Engineering / Marketing" />
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Tipe Pekerjaan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40"><MapPin className="w-5 h-5"/></div>
                      <select className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] transition-all font-medium appearance-none">
                        <option value="wfo">Work From Office (WFO)</option>
                        <option value="wfh">Remote (WFH)</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Persyaratan Utama (Di-scan AI)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none text-[#2C263F]/40"><Cpu className="w-5 h-5"/></div>
                    <textarea rows="4" placeholder="- Minimal S1 Teknik Informatika&#10;- Menguasai React.js dan Node.js&#10;- Pengalaman minimal 3 tahun" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] transition-all placeholder:text-[#2C263F]/30 leading-relaxed"></textarea>
                  </div>
                  <p className="text-[10px] text-[#2C263F]/50 mt-1.5 font-bold uppercase">Gunakan poin-poin agar ekstraksi AI lebih akurat.</p>
                </div>

                <div className="pt-4 mt-2 border-t border-[#2C263F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
                    <Cpu className="w-3.5 h-3.5" /> Auto AI-Screening ON
                  </div>
                  <button type="submit" className="w-full sm:w-auto px-8 py-4 bg-[#595082] text-white rounded-xl font-bold shadow-md hover:bg-[#2C263F] transition-colors flex items-center justify-center gap-2">
                    <Target className="w-4 h-4"/> Publish & Aktifkan AI
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- VIEW: AI SCREENING CORPORATE --- */}
        {activeMenu === 'screening' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Panel AI Screening 🤖</h2>
              <p className="text-[#2C263F]/60">Hasil pembacaan CV pelamar yang diurutkan secara cerdas oleh AI.</p>
            </header>
            
            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4 border-2 border-purple-100">
                  <Cpu className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-[#2C263F] mb-2">Menunggu Data Pelamar...</h3>
                <p className="text-[#2C263F]/60 text-sm max-w-md">Belum ada CV baru yang masuk untuk di-scan oleh sistem AI hari ini. Cek kembali nanti.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: PROFILE CORPORATE --- */}
        {activeMenu === 'profile' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Profil Perusahaan 🏢</h2>
              <p className="text-[#2C263F]/60">Lengkapi data perusahaan untuk meningkatkan kepercayaan talenta profesional.</p>
            </header>
            
            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-2xl bg-[#595082]/10 border-4 border-white shadow-lg flex items-center justify-center text-[#595082] relative overflow-hidden">
                    <Building2 className="w-12 h-12" />
                    <button className="absolute bottom-1 right-1 p-2 bg-[#595082] rounded-full shadow-md text-white hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-[#2C263F]">PT Rekrut Teknologi</h3>
                    <p className="text-xs text-[#2C263F]/50">Technology & IT Services</p>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-5">
                  <InputField label="Nama Perusahaan" name="perusahaan" icon={<Building2 className="w-5 h-5"/>} defaultValue="PT Rekrut Teknologi Indonesia" />
                  <InputField label="Industri" name="industri" icon={<Target className="w-5 h-5"/>} defaultValue="Information Technology" />
                  <InputField label="Email HR / Rekrutmen" name="emailHR" type="email" icon={<Mail className="w-5 h-5"/>} defaultValue="hr@rekruttek.com" />
                  <InputField label="Website Perusahaan" name="website" icon={<Search className="w-5 h-5"/>} defaultValue="www.rekruttek.com" />
                  
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Alamat Kantor Pusat</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none text-[#2C263F]/40"><MapPin className="w-5 h-5"/></div>
                      <textarea rows="3" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] focus:ring-1 focus:ring-[#F8C662] transition-all" defaultValue="Gedung Cyber, Lantai 12. Jl. Kuningan Barat, Jakarta Selatan."></textarea>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="px-8 py-3.5 bg-[#595082] text-white rounded-xl font-bold shadow-md hover:bg-[#2C263F] transition-colors">Simpan Profil</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: NOTIFICATIONS --- */}
        {activeMenu === 'notifications' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Notifikasi Corporate 🔔</h2>
              <p className="text-[#2C263F]/60">Update AI screening dan status interview kandidat.</p>
            </header>

            <div className="flex flex-col gap-4">
              {corporateNotifs.map((notif) => (
                <div key={notif.id} onClick={() => setSelectedNotif(notif)} className={`bg-white border-2 border-[#2C263F]/5 rounded-2xl p-5 flex gap-4 hover:shadow-md hover:border-[#2C263F]/20 transition-all cursor-pointer`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.bgClass} ${notif.textClass}`}>
                    {notif.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#2C263F] text-lg">{notif.title}</h4>
                      <div className={`w-2 h-2 rounded-full bg-[#595082] mt-2`}></div>
                    </div>
                    <p className="text-sm text-[#2C263F]/70 line-clamp-2" dangerouslySetInnerHTML={{__html: notif.desc}}></p>
                    <span className="text-xs font-bold text-[#2C263F]/40 mt-3 block">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#2C263F]/10 pb-safe z-30">
        <div className="flex items-center justify-around p-2">
          <MobileMenuButton icon={<Home />} label="Home" isActive={activeMenu === 'home'} onClick={() => setActiveMenu('home')} />
          <MobileMenuButton icon={<Search />} label="Lowongan" isActive={activeMenu === 'jobs'} onClick={() => setActiveMenu('jobs')} />
          <MobileMenuButton icon={<Cpu />} label="AI" isActive={activeMenu === 'screening'} onClick={() => setActiveMenu('screening')} />
          <MobileMenuButton icon={<Bell />} label="Notif" isActive={activeMenu === 'notifications'} onClick={() => setActiveMenu('notifications')} />
          <MobileMenuButton icon={<User />} label="Profil" isActive={activeMenu === 'profile'} onClick={() => setActiveMenu('profile')} />
        </div>
      </nav>
    </div>
  );
}

// Sub-komponen Sidebar Button
function MenuButton({ icon, label, isActive, badge, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 font-bold text-sm ${
        isActive 
          ? 'bg-[#41644A] text-[#FDFBF7] shadow-md' 
          : 'text-[#2C263F]/60 hover:bg-[#2C263F]/5 hover:text-[#2C263F]'
      }`}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        {label}
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-[#F8C662] text-[#2C263F]' : 'bg-red-500 text-white'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// Sub-komponen Bottom Nav Button
function MobileMenuButton({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 p-2 rounded-xl transition-colors ${isActive ? 'text-[#41644A]' : 'text-[#2C263F]/40'}`}>
      {React.cloneElement(icon, { className: `w-6 h-6 mb-1 ${isActive ? 'stroke-2' : 'stroke-[1.5]'}` })}
      <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
}

// ==========================================
// 4. APP UTAMA (Routing)
// ==========================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/:roleId" element={<AuthPage isLogin={true} />} />
        <Route path="/register/:roleId" element={<AuthPage isLogin={false} />} />
        {/* Tambahan Rute Dashboard Pelamar */}
        <Route path="/dashboard/jobseeker" element={<JobseekerDashboard />} />
        <Route path="/dashboard/umkm" element={<UmkmDashboard />} />
        <Route path="/dashboard/corporate" element={<CorporateDashboard />} />  
      </Routes>
    </BrowserRouter>
  );
}