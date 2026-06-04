import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Store,
  Building2,
  MapPin,
  Cpu,
  Users,
  Sparkles,
  Target,
  Home,
  Search,
  FileText,
  Bell,
  LogOut,
  DollarSign,
  HeartHandshake,
  Video,
  UploadCloud,
  Camera,
  User,
  Mail,
  CheckCircle,
} from "lucide-react";
import { MenuButton, MobileMenuButton, InputField } from "../components/SharedUI";
import { NotificationModal } from "../components/NotificationModal";
import { JobApplyModal } from "../components/JobApplyModal";
import { profileService, jobService, applicationService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
// ==========================================
// DASHBOARD: Jobseeker
// ==========================================
export default function JobseekerDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [appFilter, setAppFilter] = useState("all");
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState({
      nama: "",
      email: user?.email || "",
      alamat: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Data dari API
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    jobService.getAll()
      .then((res) => setJobs(res.data?.jobs || []))
      .catch((err) => console.error("Gagal memuat lowongan:", err));
  }, []);

  useEffect(() => {
    if (activeMenu === "applications") {
      applicationService.getMy()
        .then((res) => setMyApplications(res.data || []))
        .catch((err) => console.error("Gagal memuat lamaran:", err));
    }
  }, [activeMenu]);

  const handleApply = async (jobId) => {
    setIsApplying(true);
    try {
      await applicationService.apply({ job_id: jobId });
      alert("Lamaran berhasil dikirim!");
      setSelectedJob(null);
      // Refresh aplikasi
      const res = await applicationService.getMy();
      setMyApplications(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.error || "Gagal melamar. Coba lagi.";
      alert(msg);
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    profileService.get()
      .then((res) => {
        if (res.data) setProfile((prev) => ({ ...prev, ...res.data }));
      })
      .catch((err) => console.error("Gagal memuat profil:", err));
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await profileService.update(profile);
      alert("Profil berhasil disimpan!");
    } catch (error) {
      alert("Gagal menyimpan profil. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };
  const getInitials = (name) => {
    if (!name) return "P"; 
    const names = name.trim().split(" ");
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return names[0].substring(0, 2).toUpperCase();
  };

  const displayName = profile.nama || 'Pelamar';
  const displayInitials = getInitials(displayName);

  const aiRecommendations = [
    { id: 1, role: "Barista & Kasir", company: "Kopi Kenangan Senja", type: "umkm", salary: "Rp 2.5 Jt - 3 Jt", distance: "1.2 km", match: 95, icon: <Store className="w-5 h-5" /> },
    { id: 2, role: "Admin Gudang", company: "Toko Sembako Maju", type: "umkm", salary: "Rp 2 Jt - 2.5 Jt", distance: "3.5 km", match: 88, icon: <Store className="w-5 h-5" /> },
    { id: 3, role: "Junior Frontend Dev", company: "PT Rekrut Teknologi", type: "corporate", salary: "Rp 6 Jt - 8 Jt", distance: "12 km", match: 92, icon: <Building2 className="w-5 h-5" /> },
  ];

  const jobseekerNotifs = [
    {
      id: 1,
      title: "UMKM Bahagia Tertarik!",
      desc: 'Profilmu sangat cocok untuk posisi <b>Kasir Toko</b> (Match 95%).<br/><br/>Pihak UMKM telah mereview profilmu dan ingin melanjutkan ke tahap selanjutnya. Apakah kamu bersedia membagikan kontak WhatsApp?',
      time: "2 jam yang lalu",
      type: "match",
      icon: <HeartHandshake className="w-6 h-6" />,
      bgClass: "bg-red-50",
      textClass: "text-red-500",
      actionLabel: "Bagikan Kontak",
      actionBgClass: "bg-red-500",
    },
    {
      id: 2,
      title: "Jadwal Interview Corporate",
      desc: '<b>PT Rekrut Teknologi</b> menjadwalkan interview untuk posisi Junior Frontend Dev.<br/><br/>Jadwal: <b>Besok pukul 09:00 WIB</b><br/>Via: Google Meet<br/><br/>Harap konfirmasi kehadiran Anda melalui tombol di bawah ini.',
      time: "1 hari yang lalu",
      type: "interview",
      icon: <Video className="w-6 h-6" />,
      bgClass: "bg-purple-50",
      textClass: "text-purple-500",
      actionLabel: "Konfirmasi Hadir",
      actionBgClass: "bg-[#595082]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col md:flex-row selection:bg-[#F8C662] selection:text-[#2C263F]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col justify-between border-r border-[#2C263F]/10 bg-white/50 backdrop-blur-xl sticky top-0 h-screen p-6">
        <div>
          <div
            className="flex items-center gap-3 mb-10 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover bg-[#2C263F]/5 p-1"
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
            <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">R</div>
            <h1 className="text-2xl font-bold tracking-tight text-[#2C263F]">
              Rekrut<span className="text-[#F8C662]">Rek</span>
            </h1>
          </div>
          <nav className="flex flex-col gap-2">
            <MenuButton icon={<Home />} label="Home" isActive={activeMenu === "home"} onClick={() => setActiveMenu("home")} />
            <MenuButton icon={<Search />} label="Cari Lowongan" isActive={activeMenu === "search"} onClick={() => setActiveMenu("search")} />
            <MenuButton icon={<FileText />} label="Lamaran Saya" badge="2" isActive={activeMenu === "applications"} onClick={() => setActiveMenu("applications")} />
            <MenuButton icon={<Bell />} label="Notifikasi" badge="1" isActive={activeMenu === "notifications"} onClick={() => setActiveMenu("notifications")} />
            <MenuButton icon={<User />} label="Profil Saya" isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
          </nav>
        </div>
        <div className="mt-auto">
          <div className="p-4 rounded-2xl bg-[#41644A]/10 border border-[#41644A]/20 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#41644A] text-[#F8C662] flex items-center justify-center font-bold">
              {displayInitials}
            </div>
            <div>
              <p className="text-sm font-bold text-[#2C263F]">{displayName}</p>
              <p className="text-xs text-[#2C263F]/60">Pelamar Aktif</p>
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
        <div className="w-8 h-8 rounded-full bg-[#41644A] text-[#F8C662] flex items-center justify-center font-bold text-sm">
          {displayInitials}
        </div>      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12 relative">
        {selectedJob && <JobApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        <NotificationModal notif={selectedNotif} onClose={() => setSelectedNotif(null)} />

        {/* --- VIEW: HOME --- */}
        {activeMenu === "home" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Halo, {displayName}! 👋</h2>
              <p className="text-[#2C263F]/60">Berikut adalah rekomendasi lowongan berdasarkan skill dan lokasimu.</p>
            </header>

            <div className="bg-gradient-to-r from-[#2C263F] to-[#595082] rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F8C662]" /> Lengkapi Profilmu
                </h3>
                <p className="text-white/80 text-sm max-w-md">
                  Tingkatkan peluang dipanggil wawancara hingga 80% dengan mengunggah foto, CV, dan mengatur lokasi GPS kamu.
                </p>
              </div>
              <button onClick={() => setActiveMenu("profile")} className="relative z-10 whitespace-nowrap bg-[#F8C662] text-[#2C263F] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
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
                          <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] text-[#2C263F] flex items-center justify-center border border-[#2C263F]/10">{job.icon}</div>
                          <div>
                            <h4 className="font-bold text-[#2C263F] group-hover:text-[#41644A] transition-colors">{job.role}</h4>
                            <p className="text-sm text-[#2C263F]/60 font-medium">{job.company}</p>
                          </div>
                        </div>
                        {job.type === "umkm"
                          ? <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-[10px] font-black border border-green-200">🟢 UMKM</span>
                          : <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-[10px] font-black border border-purple-200">🟣 CORP</span>
                        }
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.distance}</span>
                        <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[#2C263F]/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${job.type === "umkm" ? "bg-[#41644A]/10 text-[#41644A]" : "bg-[#595082]/10 text-[#595082]"}`}>
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-[#2C263F]/50 font-bold uppercase tracking-wide">AI Score</p>
                          <p className={`text-sm font-black ${job.type === "umkm" ? "text-[#41644A]" : "text-[#595082]"}`}>{job.match}% Cocok</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedJob(job)} className={`px-4 py-2 text-white rounded-lg text-sm font-bold shadow-md transition-transform hover:-translate-y-0.5 ${job.type === "umkm" ? "bg-[#41644A]" : "bg-[#595082]"}`}>
                        {job.type === "umkm" ? "Detail & Tertarik" : "Detail & Lamar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: SEARCH --- */}
        {activeMenu === "search" && (() => {
          const formatSalary = (min, max) => {
            if (!min && !max) return "Gaji Tidak Disebutkan";
            const fmt = (n) => `Rp ${(n / 1000000).toFixed(1).replace('.0','')} Jt`;
            if (min && max) return `${fmt(min)} - ${fmt(max)}`;
            if (min) return `Min ${fmt(min)}`;
            return `Maks ${fmt(max)}`;
          };

          const filteredJobs = jobs.filter(
            (job) =>
              (searchFilter === "all" || job.job_type === searchFilter) &&
              (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (job.poster_name || "").toLowerCase().includes(searchQuery.toLowerCase()))
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
                  <input type="text" placeholder="Cari posisi, skill, atau perusahaan..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FDFBF7] border-none focus:outline-none focus:ring-2 focus:ring-[#F8C662] text-[#2C263F] transition-all"
                  />
                </div>
                <div className="flex gap-2 bg-[#FDFBF7] p-1.5 rounded-2xl overflow-x-auto hide-scrollbar">
                  <button onClick={() => setSearchFilter("all")} className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-colors ${searchFilter === "all" ? "bg-[#2C263F] text-white shadow-md" : "text-[#2C263F]/60 hover:bg-[#2C263F]/5"}`}>Semua</button>
                  <button onClick={() => setSearchFilter("umkm")} className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-colors ${searchFilter === "umkm" ? "bg-[#41644A] text-white shadow-md" : "text-[#41644A]/70 hover:bg-[#41644A]/10"}`}>UMKM</button>
                  <button onClick={() => setSearchFilter("corporate")} className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-colors ${searchFilter === "corporate" ? "bg-[#595082] text-white shadow-md" : "text-[#595082]/70 hover:bg-[#595082]/10"}`}>Corporate</button>
                </div>
              </div>

              {/* Job List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 hover:shadow-xl hover:border-[#F8C662]/50 transition-all group cursor-pointer flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] text-[#2C263F] flex items-center justify-center border border-[#2C263F]/10">
                              {job.job_type === "umkm" ? <Store className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-[#2C263F] group-hover:text-[#F8C662] transition-colors">{job.title}</h4>
                              <p className="text-sm text-[#2C263F]/60 font-medium">{job.poster_name || "-"}</p>
                            </div>
                          </div>
                          {job.job_type === "umkm"
                            ? <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-[10px] font-black border border-green-200">🟢 UMKM</span>
                            : <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-[10px] font-black border border-purple-200">🟣 CORP</span>
                          }
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {job.address && <span className="px-3 py-1.5 bg-[#FDFBF7] border border-[#2C263F]/5 text-[#2C263F]/70 rounded-xl text-xs font-bold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.address}</span>}
                          <span className="px-3 py-1.5 bg-[#FDFBF7] border border-[#2C263F]/5 text-[#2C263F]/70 rounded-xl text-xs font-bold flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {formatSalary(job.salary_min, job.salary_max)}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-[#2C263F]/10 flex items-center justify-end">
                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={isApplying}
                          className={`px-6 py-2.5 text-white rounded-xl text-sm font-bold shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-50 ${job.job_type === "umkm" ? "bg-[#41644A]" : "bg-[#595082]"}`}
                        >
                          {isApplying ? "Mengirim..." : job.job_type === "umkm" ? "Tertarik" : "Lamar"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-2 text-center py-20 bg-white border border-[#2C263F]/10 rounded-3xl">
                    <Search className="w-12 h-12 text-[#2C263F]/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#2C263F]">{jobs.length === 0 ? "Belum Ada Lowongan" : "Pencarian Tidak Ditemukan"}</h3>
                    <p className="text-sm text-[#2C263F]/50 mt-2">{jobs.length === 0 ? "Belum ada lowongan yang dibuka saat ini." : "Coba gunakan kata kunci atau filter lain."}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* --- VIEW: PROFILE --- */}
        {activeMenu === "profile" && (
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
                    <h3 className="font-bold text-lg text-[#2C263F]">{displayName}</h3>
                    <p className="text-xs text-[#2C263F]/50">Pelamar Aktif</p>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-5">
                  <InputField label="Nama Lengkap" name="nama" icon={<User className="w-5 h-5" />} value={profile.nama || ""} onChange={handleProfileChange} />
                  <InputField label="Email" name="email" type="email" icon={<Mail className="w-5 h-5" />} value={profile.email || ""} disabled />
                  <InputField label="Alamat Domisili" name="alamat" icon={<MapPin className="w-5 h-5" />} value={profile.alamat || ""} onChange={handleProfileChange} />
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Curriculum Vitae (CV)</label>
                    <div className="border-2 border-dashed border-[#2C263F]/20 rounded-2xl p-6 flex flex-col items-center justify-center bg-[#FDFBF7] hover:bg-[#2C263F]/5 cursor-pointer transition-colors group">
                      <UploadCloud className="w-8 h-8 text-[#41644A] mb-2 group-hover:-translate-y-1 transition-transform" />
                      <p className="text-sm font-bold text-[#2C263F]">Klik untuk unggah CV terbaru</p>
                      <p className="text-xs text-[#2C263F]/50">PDF maksimal 5MB. AI akan otomatis mengekstrak skill Anda.</p>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button onClick={handleSaveProfile} disabled={isSaving} className={`px-8 py-3.5 bg-[#41644A] text-white rounded-xl font-bold shadow-md transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#213722]'}`}>
                      {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
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
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Notifikasi 🔔</h2>
              <p className="text-[#2C263F]/60">Pembaruan terbaru tentang lamaran dan akunmu.</p>
            </header>
            <div className="flex flex-col gap-4">
              {jobseekerNotifs.map((notif) => (
                <div key={notif.id} onClick={() => setSelectedNotif(notif)} className="bg-white border-2 border-[#2C263F]/5 rounded-2xl p-5 flex gap-4 hover:shadow-md hover:border-[#2C263F]/20 transition-all cursor-pointer">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.bgClass} ${notif.textClass}`}>{notif.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-[#2C263F] text-lg">{notif.title}</h4>
                      <div className={`w-2 h-2 rounded-full ${notif.type === "match" ? "bg-red-500" : "bg-purple-500"} mt-2`} />
                    </div>
                    <p className="text-sm text-[#2C263F]/70 line-clamp-2" dangerouslySetInnerHTML={{ __html: notif.desc }} />
                    <span className="text-xs font-bold text-[#2C263F]/40 mt-3 block">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW: APPLICATIONS --- */}
        {activeMenu === "applications" && (() => {
          const statusLabel = { pending: "Menunggu Review", reviewed: "Ditinjau", accepted: "Diterima", rejected: "Ditolak" };
          const statusStyle = {
            pending:  { bg: "bg-[#2C263F]/5",  color: "text-[#2C263F]/60", border: "border-[#2C263F]/10" },
            reviewed: { bg: "bg-blue-50",       color: "text-blue-600",     border: "border-blue-200" },
            accepted: { bg: "bg-green-50",      color: "text-green-700",    border: "border-green-200" },
            rejected: { bg: "bg-red-50",        color: "text-red-600",      border: "border-red-200" },
          };
          const filteredApps = appFilter === "all" ? myApplications : myApplications.filter((app) => app.status === appFilter);

          return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
              <header className="mb-8">
                <h2 className="text-3xl font-black text-[#2C263F] mb-2">Lamaran Saya 📄</h2>
                <p className="text-[#2C263F]/60">Pantau status lamaran kerja Anda di UMKM maupun Corporate.</p>
              </header>
              <div className="flex gap-2 bg-white border border-[#2C263F]/10 p-2 rounded-2xl mb-8 overflow-x-auto hide-scrollbar shadow-sm">
                <button onClick={() => setAppFilter("all")} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${appFilter === "all" ? "bg-[#2C263F] text-white shadow-md" : "text-[#2C263F]/60 hover:bg-[#2C263F]/5"}`}>Semua</button>
                <button onClick={() => setAppFilter("pending")} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${appFilter === "pending" ? "bg-[#41644A] text-white shadow-md" : "text-[#41644A]/70 hover:bg-[#41644A]/10"}`}>Menunggu</button>
                <button onClick={() => setAppFilter("accepted")} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${appFilter === "accepted" ? "bg-green-600 text-white shadow-md" : "text-green-600/70 hover:bg-green-50"}`}>Diterima</button>
                <button onClick={() => setAppFilter("rejected")} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${appFilter === "rejected" ? "bg-red-500 text-white shadow-md" : "text-red-500/70 hover:bg-red-50"}`}>Ditolak</button>
              </div>
              <div className="flex flex-col gap-4">
                {filteredApps.length > 0 ? filteredApps.map((app) => {
                  const s = statusStyle[app.status] || statusStyle.pending;
                  return (
                    <div key={app.id} className="bg-white border border-[#2C263F]/10 rounded-3xl p-5 md:p-6 hover:shadow-xl hover:border-[#F8C662]/50 transition-all group flex flex-col md:flex-row gap-5 md:items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${app.job_type === "umkm" ? "bg-green-50 text-green-700 border-green-200" : "bg-purple-50 text-purple-700 border-purple-200"}`}>
                          {app.job_type === "umkm" ? <Store className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg text-[#2C263F] group-hover:text-[#F8C662] transition-colors">{app.title}</h4>
                            <span className="text-xs font-bold text-[#2C263F]/40">• {new Date(app.applied_at).toLocaleDateString("id-ID")}</span>
                          </div>
                          <p className="text-sm text-[#2C263F]/70 font-medium mb-3">{app.poster_name || "-"}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${s.bg} ${s.color} ${s.border}`}>
                              {statusLabel[app.status] || app.status}
                            </span>
                            {app.match_score && (
                              <span className="px-3 py-1.5 bg-[#FDFBF7] border border-[#2C263F]/10 rounded-xl text-xs font-bold text-[#41644A] flex items-center gap-1">
                                <Target className="w-3 h-3" /> AI Score: {Math.round(app.match_score)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-20 bg-white border border-[#2C263F]/10 rounded-3xl">
                    <FileText className="w-12 h-12 text-[#2C263F]/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#2C263F]">Belum Ada Lamaran</h3>
                    <p className="text-sm text-[#2C263F]/50 mt-2">Mulai cari lowongan dan kirim lamaran pertamamu!</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#2C263F]/10 pb-safe z-30">
        <div className="flex items-center justify-around p-2">
          <MobileMenuButton icon={<Home />} label="Home" isActive={activeMenu === "home"} onClick={() => setActiveMenu("home")} />
          <MobileMenuButton icon={<Search />} label="Cari" isActive={activeMenu === "search"} onClick={() => setActiveMenu("search")} />
          <MobileMenuButton icon={<FileText />} label="Lamaran" isActive={activeMenu === "applications"} onClick={() => setActiveMenu("applications")} />
          <MobileMenuButton icon={<Bell />} label="Notif" isActive={activeMenu === "notifications"} onClick={() => setActiveMenu("notifications")} />
          <MobileMenuButton icon={<User />} label="Profil" isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
        </div>
      </nav>
    </div>
  );
}