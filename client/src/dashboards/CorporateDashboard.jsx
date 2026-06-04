import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Store, Building2, ArrowLeft, Home, Search, Cpu, Bell, User, LogOut, Bookmark, MapPin, DollarSign, Users, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { MenuButton, MobileMenuButton, InputField } from "../components/SharedUI";
import { NotificationModal } from "../components/NotificationModal";

// ==========================================
// DASHBOARD: Corporate
// ==========================================
export default function CorporateDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  
  const [activeMenu, setActiveMenu] = useState('home');

  const stats = [
    { label: "Lowongan Aktif", value: "5" },
    { label: "Kandidat Tersaring", value: "120" },
    { label: "Interview", value: "20" },
  ];

  const pipeline = [
    { stage: "Applied", count: "120" },
    { stage: "Screening", count: "60" },
    { stage: "Interview", count: "20" },
    { stage: "Accepted", count: "4" },
  ];

  const candidates = [
    { id: 1, name: "Naila Atha", role: "Frontend Dev", score: 96, status: "AI Screening" },
    { id: 2, name: "Andi Pratama", role: "UI/UX Designer", score: 92, status: "HR Review" },
    { id: 3, name: "Siti Rahma", role: "Data Analyst", score: 89, status: "Interview" },
  ];

  const corporateNotifs = [
    {
      id: 1,
      title: "AI Screening Selesai",
      desc: 'AI telah selesai menyeleksi 150 CV untuk posisi <b>Frontend Developer</b>.<br/><br/>Ditemukan 20 kandidat dengan skor kecocokan tinggi (Shortlisted) di atas 85%. Silakan review kandidat tersebut untuk menjadwalkan interview.',
      time: "30 menit yang lalu",
      type: "system",
      icon: <Cpu className="w-6 h-6" />,
      bgClass: "bg-[#595082]/10",
      textClass: "text-[#595082]",
      actionLabel: "Lihat Hasil Screening",
      actionBgClass: "bg-[#595082]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col md:flex-row selection:bg-[#F8C662] selection:text-[#2C263F]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col justify-between border-r border-[#2C263F]/10 bg-white/50 backdrop-blur-xl sticky top-0 h-screen p-6">
        <div>
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-[#2C263F]/5 p-1"
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
            <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">R</div>
            <h1 className="text-2xl font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
          </div>
          <nav className="flex flex-col gap-2">
            <MenuButton icon={<Home />} label="Home" isActive={activeMenu === "home"} onClick={() => setActiveMenu("home")} />
            <MenuButton icon={<Search />} label="Lowongan" isActive={activeMenu === "jobs"} onClick={() => setActiveMenu("jobs")} />
            <MenuButton icon={<Cpu />} label="AI Screening" badge="8" isActive={activeMenu === "screening"} onClick={() => setActiveMenu("screening")} />
            <MenuButton icon={<Bell />} label="Notifikasi" badge="2" isActive={activeMenu === "notifications"} onClick={() => setActiveMenu("notifications")} />
            <MenuButton icon={<User />} label="Profil Perusahaan" isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
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
          <button onClick={() => navigate("/")} className="flex items-center gap-3 w-full p-3 rounded-xl text-[#2C263F]/60 hover:text-red-500 hover:bg-red-50 transition-colors font-medium text-sm">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#2C263F]/10 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover bg-[#2C263F]/5 p-0.5"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
          <div className="hidden w-8 h-8 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-sm">R</div>
          <h1 className="text-lg font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#595082] text-[#F8C662] flex items-center justify-center font-bold text-sm">CP</div>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12 relative">
        <NotificationModal notif={selectedNotif} onClose={() => setSelectedNotif(null)} />

        {/* --- VIEW: HOME --- */}
        {activeMenu === "home" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Halo, PT Rekrut Teknologi 👋</h2>
              <p className="text-[#2C263F]/60">Pantau proses screening, ranking kandidat, dan pipeline rekrutmen perusahaanmu.</p>
            </header>

            <div className="bg-gradient-to-r from-[#2C263F] to-[#595082] rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu className="w-5 h-5 text-[#F8C662]" /> AI Screening Aktif</h3>
                <p className="text-white/80 text-sm max-w-md">CV kandidat sedang diproses otomatis untuk menemukan kandidat terbaik sebelum interview.</p>
              </div>
              <button className="relative z-10 whitespace-nowrap bg-[#F8C662] text-[#2C263F] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
                Review Kandidat
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {stats.map((s) => (
                <div key={s.label} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wide text-[#2C263F]/50 font-bold mb-2">{s.label}</p>
                  <h4 className="text-3xl font-black text-[#595082]">{s.value}</h4>
                </div>
              ))}
            </div>

            {/* Top Candidates */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2"><FileText className="w-6 h-6 text-[#595082]" /> Kandidat Terbaik</h3>
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
                    <button className="text-[#2C263F]/30 hover:text-[#F8C662] transition-colors"><Bookmark className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1"><Target className="w-3 h-3" /> {c.score}% Score</span>
                    <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1"><Bell className="w-3 h-3" /> {c.status}</span>
                  </div>
                  <div className="pt-4 border-t border-[#2C263F]/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#2C263F]/50 font-bold uppercase tracking-wide">Rekomendasi AI</p>
                      <p className="text-sm font-black text-[#595082]">Sangat Cocok</p>
                    </div>
                    <button className="px-4 py-2 bg-[#595082] text-[#FDFBF7] rounded-lg text-sm font-bold shadow-md hover:bg-[#2C263F] transition-colors">Buka CV</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2"><Users className="w-6 h-6 text-[#595082]" /> Pipeline Rekrutmen</h3>
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
        )}

        {/* --- VIEW: LOWONGAN --- */}
        {activeMenu === "jobs" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Posting Lowongan Profesional 📝</h2>
              <p className="text-[#2C263F]/60">Jabarkan kualifikasi dengan detail. AI akan menggunakannya untuk men-screening CV pelamar.</p>
            </header>
            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); alert("Lowongan berhasil diposting! AI Screening diaktifkan."); setActiveMenu("home"); }} className="flex flex-col gap-5">
                <InputField label="Job Title" name="title" icon={<Briefcase className="w-5 h-5" />} placeholder="e.g. Senior Frontend Developer" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Departemen" name="dept" icon={<Building2 className="w-5 h-5" />} placeholder="e.g. Engineering / Marketing" />
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Tipe Pekerjaan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40"><MapPin className="w-5 h-5" /></div>
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
                    <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none text-[#2C263F]/40"><Cpu className="w-5 h-5" /></div>
                    <textarea rows="4" placeholder={"- Minimal S1 Teknik Informatika\n- Menguasai React.js dan Node.js\n- Pengalaman minimal 3 tahun"} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] transition-all placeholder:text-[#2C263F]/30 leading-relaxed" />
                  </div>
                  <p className="text-[10px] text-[#2C263F]/50 mt-1.5 font-bold uppercase">Gunakan poin-poin agar ekstraksi AI lebih akurat.</p>
                </div>
                <div className="pt-4 mt-2 border-t border-[#2C263F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
                    <Cpu className="w-3.5 h-3.5" /> Auto AI-Screening ON
                  </div>
                  <button type="submit" className="w-full sm:w-auto px-8 py-4 bg-[#595082] text-white rounded-xl font-bold shadow-md hover:bg-[#2C263F] transition-colors flex items-center justify-center gap-2">
                    <Target className="w-4 h-4" /> Publish & Aktifkan AI
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- VIEW: AI SCREENING --- */}
        {activeMenu === "screening" && (
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
        {activeMenu === "profile" && (
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
                    <button className="absolute bottom-1 right-1 p-2 bg-[#595082] rounded-full shadow-md text-white hover:scale-110 transition-transform"><Camera className="w-4 h-4" /></button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-[#2C263F]">
                      {user?.company_name || 'Nama Perusahaan Belum Diatur'}
                    </h3>
                    <p className="text-xs text-[#2C263F]/50">
                      {user?.industry || 'Industri Belum Diatur'}
                    </p>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-5">
                  <InputField label="Nama Perusahaan" name="perusahaan" icon={<Building2 className="w-5 h-5" />} defaultValue={user?.company_name || ''} />
                    <InputField label="Industri" name="industri" icon={<Target className="w-5 h-5" />} defaultValue={user?.industry || ''} />
                    <InputField label="Email HR / Rekrutmen" name="emailHR" type="email" icon={<Mail className="w-5 h-5" />} defaultValue={user?.email || ''} disabled />
                    <InputField label="Website Perusahaan" name="website" icon={<Search className="w-5 h-5" />} defaultValue={user?.website || ''} />
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Alamat Kantor Pusat</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none text-[#2C263F]/40"><MapPin className="w-5 h-5" /></div>
                      <textarea rows="3" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] focus:ring-1 focus:ring-[#F8C662] transition-all" defaultValue="Gedung Cyber, Lantai 12. Jl. Kuningan Barat, Jakarta Selatan." />
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
        {activeMenu === "notifications" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Notifikasi Corporate 🔔</h2>
              <p className="text-[#2C263F]/60">Update AI screening dan status interview kandidat.</p>
            </header>
            <div className="flex flex-col gap-4">
              {corporateNotifs.map((notif) => (
                <div key={notif.id} onClick={() => setSelectedNotif(notif)} className="bg-white border-2 border-[#2C263F]/5 rounded-2xl p-5 flex gap-4 hover:shadow-md hover:border-[#2C263F]/20 transition-all cursor-pointer">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.bgClass} ${notif.textClass}`}>{notif.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#2C263F] text-lg">{notif.title}</h4>
                      <div className="w-2 h-2 rounded-full bg-[#595082] mt-2" />
                    </div>
                    <p className="text-sm text-[#2C263F]/70 line-clamp-2" dangerouslySetInnerHTML={{ __html: notif.desc }} />
                    <span className="text-xs font-bold text-[#2C263F]/40 mt-3 block">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#2C263F]/10 pb-safe z-30">
        <div className="flex items-center justify-around p-2">
          <MobileMenuButton icon={<Home />} label="Home" isActive={activeMenu === "home"} onClick={() => setActiveMenu("home")} />
          <MobileMenuButton icon={<Search />} label="Lowongan" isActive={activeMenu === "jobs"} onClick={() => setActiveMenu("jobs")} />
          <MobileMenuButton icon={<Cpu />} label="AI" isActive={activeMenu === "screening"} onClick={() => setActiveMenu("screening")} />
          <MobileMenuButton icon={<Bell />} label="Notif" isActive={activeMenu === "notifications"} onClick={() => setActiveMenu("notifications")} />
          <MobileMenuButton icon={<User />} label="Profil" isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
        </div>
      </nav>
    </div>
  );
}