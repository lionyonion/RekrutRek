import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  MapPin,
  Users,
  Sparkles,
  Target,
  Home,
  Search,
  FileText,
  Bell,
  LogOut,
  DollarSign,
  Bookmark,
  Camera,
  User,
  Phone,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import { MenuButton, MobileMenuButton, InputField } from "../components/SharedUI";
import { NotificationModal } from "../components/NotificationModal";

// ==========================================
// DASHBOARD: UMKM
// ==========================================
export default function UmkmDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("home");
  const [selectedNotif, setSelectedNotif] = useState(null);

  const stats = [
    { label: "Lowongan Aktif", value: "7" },
    { label: "Pelamar Masuk", value: "42" },
    { label: "Match Tinggi", value: "18" },
  ];

  const candidates = [
    { id: 1, name: "Naila Atha", role: "Kasir", match: 95, distance: "1.2 km", salary: "Rp 2.5 Jt" },
    { id: 2, name: "Andi Pratama", role: "Admin Toko", match: 91, distance: "2.4 km", salary: "Rp 2.2 Jt" },
    { id: 3, name: "Siti Rahma", role: "Crew Store", match: 88, distance: "3.1 km", salary: "Rp 2.3 Jt" },
  ];

  const jobs = [
    { id: 1, title: "Kasir Toko", applicants: "12 Pelamar", status: "Aktif" },
    { id: 2, title: "Admin Gudang", applicants: "8 Pelamar", status: "Aktif" },
    { id: 3, title: "Crew Outlet", applicants: "5 Pelamar", status: "Pending" },
  ];

  const umkmNotifs = [
    {
      id: 1,
      title: "Kandidat Baru Masuk!",
      desc: '<b>Naila Atha</b> (Match 95%) tertarik dengan lowongan <b>Kasir Toko</b> Anda.<br/><br/>Jarak kandidat hanya <b>1.2 km</b> dari lokasi Anda. Segera lakukan review profil dan klik tertarik agar sistem membagikan kontak WhatsApp pelamar kepada Anda.',
      time: "10 menit yang lalu",
      type: "candidate",
      icon: <Users className="w-6 h-6" />,
      bgClass: "bg-[#41644A]/10",
      textClass: "text-[#41644A]",
      actionLabel: "Review Kandidat",
      actionBgClass: "bg-[#F8C662] text-[#2C263F]",
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
            <MenuButton icon={<Search />} label="Buat Lowongan" isActive={activeMenu === "jobs"} onClick={() => setActiveMenu("jobs")} />
            <MenuButton icon={<FileText />} label="Kandidat" badge="4" isActive={activeMenu === "candidates"} onClick={() => setActiveMenu("candidates")} />
            <MenuButton icon={<Bell />} label="Notifikasi" badge="2" isActive={activeMenu === "notifications"} onClick={() => setActiveMenu("notifications")} />
            <MenuButton icon={<User />} label="Profil UMKM" isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
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
        <div className="w-8 h-8 rounded-full bg-[#41644A] text-[#F8C662] flex items-center justify-center font-bold text-sm">UM</div>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12 relative">
        <NotificationModal notif={selectedNotif} onClose={() => setSelectedNotif(null)} />

        {/* --- VIEW: HOME --- */}
        {activeMenu === "home" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Halo, UMKM Bahagia 👋</h2>
              <p className="text-[#2C263F]/60">Kelola lowongan dan temukan kandidat terdekat yang paling cocok.</p>
            </header>

            <div className="bg-gradient-to-r from-[#2C263F] to-[#595082] rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#F8C662]" /> Lengkapi Profil UMKM</h3>
                <p className="text-white/80 text-sm max-w-md">Tambahkan lokasi usaha, kategori, dan kontak PIC agar kandidat mudah menemukan toko kamu.</p>
              </div>
              <button onClick={() => setActiveMenu("profile")} className="relative z-10 whitespace-nowrap bg-[#F8C662] text-[#2C263F] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
                Lengkapi Sekarang
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wide text-[#2C263F]/50 font-bold mb-2">{s.label}</p>
                  <h4 className="text-3xl font-black text-[#41644A]">{s.value}</h4>
                </div>
              ))}
            </div>

            {/* Top Candidates */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2"><Target className="w-6 h-6 text-[#41644A]" /> Kandidat Terbaik</h3>
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
                    <button className="text-[#2C263F]/30 hover:text-[#F8C662] transition-colors"><Bookmark className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.distance}</span>
                    <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1"><DollarSign className="w-3 h-3" /> {c.salary}</span>
                  </div>
                  <div className="pt-4 border-t border-[#2C263F]/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#2C263F]/50 font-bold uppercase tracking-wide">Match Score</p>
                      <p className="text-sm font-black text-[#41644A]">{c.match}% Cocok</p>
                    </div>
                    <button className="px-4 py-2 bg-[#41644A] text-[#FDFBF7] rounded-lg text-sm font-bold shadow-md hover:bg-[#213722] transition-colors">Lihat Profil</button>
                  </div>
                </div>
              ))}
            </div>

            {/* My Jobs */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2"><Store className="w-6 h-6 text-[#41644A]" /> Lowongan Saya</h3>
              <button className="text-sm font-bold text-[#41644A] hover:underline">Tambah Lowongan</button>
            </div>
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#2C263F]">{job.title}</h4>
                    <p className="text-sm text-[#2C263F]/60">{job.applicants}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${job.status === "Aktif" ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW: BUAT LOWONGAN --- */}
        {activeMenu === "jobs" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Buat Lowongan UMKM 📝</h2>
              <p className="text-[#2C263F]/60">Sistem AI akan otomatis mencocokkan lowongan ini dengan pelamar terdekat.</p>
            </header>
            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); alert("Lowongan berhasil dipublish! AI mulai mencari kandidat."); setActiveMenu("home"); }} className="flex flex-col gap-5">
                <InputField label="Nama Posisi (Jabatan)" name="title" icon={<Briefcase className="w-5 h-5" />} placeholder="Contoh: Kasir Toko, Barista, Staff Gudang" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Estimasi Gaji Bulanan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40"><DollarSign className="w-5 h-5" /></div>
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
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40"><Store className="w-5 h-5" /></div>
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
                        <span className="px-4 py-2 rounded-xl text-sm font-bold border border-[#2C263F]/10 text-[#2C263F]/60 peer-checked:bg-[#41644A] peer-checked:text-white peer-checked:border-[#41644A] transition-all block hover:bg-black/5">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-4 mt-2 border-t border-[#2C263F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[#2C263F]/50 max-w-sm">Lokasi lowongan otomatis mengikuti alamat profil UMKM Anda untuk fitur pencocokan jarak.</p>
                  <button type="submit" className="w-full sm:w-auto px-8 py-4 bg-[#41644A] text-white rounded-xl font-bold shadow-md hover:bg-[#213722] transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Publish ke Pelamar Sekitar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- VIEW: KANDIDAT --- */}
        {activeMenu === "candidates" && (
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
        {activeMenu === "profile" && (
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
                    <button className="absolute bottom-1 right-1 p-2 bg-[#41644A] rounded-full shadow-md text-white hover:scale-110 transition-transform"><Camera className="w-4 h-4" /></button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-[#2C263F]">UMKM Bahagia</h3>
                    <p className="text-xs text-[#2C263F]/50">Retail & Minimarket</p>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-5">
                  <InputField label="Nama Usaha (UMKM)" name="namaUsaha" icon={<Store className="w-5 h-5" />} defaultValue="UMKM Bahagia Sejahtera" />
                  <InputField label="Kategori Bisnis" name="kategori" icon={<Target className="w-5 h-5" />} defaultValue="Retail & Kelontong" />
                  <InputField label="Nama PIC / Pemilik" name="pic" icon={<User className="w-5 h-5" />} defaultValue="Pak Budi" />
                  <InputField label="Nomor WhatsApp" name="wa" type="tel" icon={<Phone className="w-5 h-5" />} defaultValue="081234567890" />
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Alamat Lengkap Toko</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none text-[#2C263F]/40"><MapPin className="w-5 h-5" /></div>
                      <textarea rows="3" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] focus:ring-1 focus:ring-[#F8C662] transition-all" defaultValue="Jl. Merdeka No. 45, Kecamatan Sukamaju, Kota Sejahtera" />
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
        {activeMenu === "notifications" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Notifikasi UMKM 🔔</h2>
              <p className="text-[#2C263F]/60">Informasi kandidat dan lamaran masuk terbaru.</p>
            </header>
            <div className="flex flex-col gap-4">
              {umkmNotifs.map((notif) => (
                <div key={notif.id} onClick={() => setSelectedNotif(notif)} className="bg-white border-2 border-[#2C263F]/5 rounded-2xl p-5 flex gap-4 hover:shadow-md hover:border-[#2C263F]/20 transition-all cursor-pointer">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.bgClass} ${notif.textClass}`}>{notif.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#2C263F] text-lg">{notif.title}</h4>
                      <div className="w-2 h-2 rounded-full bg-[#41644A] mt-2" />
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
          <MobileMenuButton icon={<Search />} label="Buat Lowongan" isActive={activeMenu === "jobs"} onClick={() => setActiveMenu("jobs")} />
          <MobileMenuButton icon={<FileText />} label="Kandidat" isActive={activeMenu === "candidates"} onClick={() => setActiveMenu("candidates")} />
          <MobileMenuButton icon={<Bell />} label="Notif" isActive={activeMenu === "notifications"} onClick={() => setActiveMenu("notifications")} />
          <MobileMenuButton icon={<User />} label="Profil" isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
        </div>
      </nav>
    </div>
  );
}