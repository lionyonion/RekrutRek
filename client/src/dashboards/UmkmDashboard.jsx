import { useState, useEffect, useRef } from "react";
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
  Camera,
  User,
  Phone,
  CheckCircle,
  Briefcase,
  ExternalLink,
  Navigation,
  X,
} from "lucide-react";
import { MenuButton, MobileMenuButton, InputField } from "../components/SharedUI";
import MapPicker from "../components/MapPicker";
import { profileService, jobService, applicationService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useReadNotifs } from "../hooks/useReadNotifs";

// Modal untuk review CV + detail kandidat
const resolveUrl = (url) => {
  if (!url) return null
  if (url.startsWith('blob:') || url.startsWith('http')) return url
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`
}

function CandidateModal({ candidate, onClose, onStatusChange }) {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C263F]/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#2C263F]/10 flex items-center justify-between bg-[#FDFBF7]">
          <h3 className="font-bold text-lg text-[#2C263F]">Detail Pelamar</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#2C263F]/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-[#2C263F]/60" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#41644A]/10 text-[#41644A] flex items-center justify-center font-bold text-xl">
              {(candidate.full_name || candidate.email || "?")[0].toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#2C263F]">{candidate.full_name || "—"}</h4>
              <p className="text-sm text-[#2C263F]/60">{candidate.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FDFBF7] rounded-xl p-3 border border-[#2C263F]/5">
              <p className="text-[10px] font-bold uppercase text-[#2C263F]/50 mb-1">Posisi</p>
              <p className="text-sm font-bold text-[#2C263F]">{candidate.job_title}</p>
            </div>
            {candidate.phone && (
              <div className="bg-[#FDFBF7] rounded-xl p-3 border border-[#2C263F]/5">
                <p className="text-[10px] font-bold uppercase text-[#2C263F]/50 mb-1">Nomor HP</p>
                <p className="text-sm font-bold text-[#2C263F]">{candidate.phone}</p>
              </div>
            )}
            {candidate.distance_km != null && (
              <div className="bg-[#41644A]/10 rounded-xl p-3 border border-[#41644A]/20">
                <p className="text-[10px] font-bold uppercase text-[#41644A]/70 mb-1">Jarak dari Toko</p>
                <p className="text-sm font-bold text-[#41644A]">{candidate.distance_km} km</p>
              </div>
            )}
            {candidate.salary_expect && (
              <div className="bg-[#FDFBF7] rounded-xl p-3 border border-[#2C263F]/5">
                <p className="text-[10px] font-bold uppercase text-[#2C263F]/50 mb-1">Ekspektasi Gaji</p>
                <p className="text-sm font-bold text-[#2C263F]">Rp {Number(candidate.salary_expect).toLocaleString("id-ID")}</p>
              </div>
            )}
            {candidate.match_score && (
              <div className="bg-[#41644A]/10 rounded-xl p-3 border border-[#41644A]/20">
                <p className="text-[10px] font-bold uppercase text-[#41644A]/70 mb-1">AI Score</p>
                <p className="text-sm font-bold text-[#41644A]">{Math.round(candidate.match_score)}% Cocok</p>
              </div>
            )}
          </div>

          {candidate.cv_url ? (
            <a
              href={resolveUrl(candidate.cv_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#41644A] text-white rounded-xl font-bold text-sm hover:bg-[#213722] transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Buka CV (PDF)
            </a>
          ) : (
            <div className="text-center py-3 bg-[#2C263F]/5 rounded-xl text-sm text-[#2C263F]/50 font-medium">
              Pelamar belum mengupload CV
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-[#2C263F]/10">
            <button
              onClick={() => onStatusChange(candidate.id, "accepted")}
              className="flex-1 py-3 bg-[#41644A] text-white rounded-xl font-bold text-sm hover:bg-[#213722] transition-colors"
            >Terima</button>
            <button
              onClick={() => onStatusChange(candidate.id, "rejected")}
              className="flex-1 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
            >Tolak</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD: UMKM
// ==========================================
export default function UmkmDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount, markAllRead } = useReadNotifs("notif_read_umkm");
  const [activeMenu, setActiveMenu] = useState("home");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const photoInputRef = useRef(null);

  const [profile, setProfile] = useState({
    business_name: "",
    business_type: "",
    address: "",
    phone: "",
    latitude: null,
    longitude: null,
    photo_url: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    profileService.get().then((res) => {
      if (res.data) {
        setProfile((prev) => ({ ...prev, ...res.data }));
        if (res.data.photo_url) setPhotoPreview(res.data.photo_url);
      }
    }).catch(console.error);
  }, []);

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await profileService.update(profile);
      alert("Profil berhasil disimpan!");
    } catch {
      alert("Gagal menyimpan profil. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setIsUploadingPhoto(true);
    try {
      const res = await profileService.uploadPhoto(file);
      setProfile((prev) => ({ ...prev, photo_url: res.data.photo_url }));
    } catch {
      alert("Gagal upload foto.");
      setPhotoPreview(null);
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("Browser tidak mendukung GPS");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setProfile((prev) => ({ ...prev, latitude: coords.latitude, longitude: coords.longitude }));
        alert("Lokasi terdeteksi! Klik Simpan Profil.");
      },
      () => alert("Gagal mendapatkan lokasi GPS.")
    );
  };

  const getInitials = (name) => {
    if (!name) return "UM";
    const names = name.trim().split(" ");
    return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : names[0].substring(0, 2).toUpperCase();
  };

  const displayName = profile.business_name || "UMKM";
  const displayInitials = getInitials(displayName);

  const [myJobs, setMyJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [jobForm, setJobForm] = useState({ title: "", salary_range: "", skills: [] });
  const [isPostingJob, setIsPostingJob] = useState(false);

  useEffect(() => {
    jobService.getMy().then((res) => setMyJobs(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeMenu === "candidates" || activeMenu === "notifications") {
      applicationService.getForMyJobs().then((res) => setCandidates(res.data || [])).catch(console.error);
    }
  }, [activeMenu]);

  const SALARY_OPTIONS = {
    "1": { min: null, max: 1500000 },
    "2": { min: 1500000, max: 2500000 },
    "3": { min: 2500000, max: 3500000 },
    "4": { min: 3500000, max: null },
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title) return alert("Nama posisi wajib diisi.");
    setIsPostingJob(true);
    try {
      const salaryRange = SALARY_OPTIONS[jobForm.salary_range] || {};
      await jobService.create({
        title: jobForm.title,
        description: jobForm.skills.join(", "),
        requirements: jobForm.skills.join(", "),
        salary_min: salaryRange.min,
        salary_max: salaryRange.max,
        latitude: profile.latitude,
        longitude: profile.longitude,
        address: profile.address,
      });
      alert("Lowongan berhasil dipublish!");
      setJobForm({ title: "", salary_range: "", skills: [] });
      setActiveMenu("home");
      const res = await jobService.getMy();
      setMyJobs(res.data || []);
    } catch (err) {
      alert(err.response?.data?.error || "Gagal posting lowongan.");
    } finally {
      setIsPostingJob(false);
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      await applicationService.updateStatus(appId, status);
      const res = await applicationService.getForMyJobs();
      setCandidates(res.data || []);
      setSelectedCandidate(null);
    } catch {
      alert("Gagal memperbarui status.");
    }
  };

  // Real notifications from pending applications
  const pendingCandidates = candidates.filter((c) => c.status === "pending");
  const notifIds = pendingCandidates.map((c) => c.id);
  const unreadNotifCount = unreadCount(notifIds);

  useEffect(() => {
    if (activeMenu === "notifications" && notifIds.length > 0) {
      markAllRead(notifIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu, pendingCandidates.length]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col md:flex-row selection:bg-[#F8C662] selection:text-[#2C263F]">
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={handleStatusChange}
        />
      )}

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
            <MenuButton icon={<FileText />} label="Kandidat" badge={candidates.length > 0 ? String(candidates.length) : undefined} isActive={activeMenu === "candidates"} onClick={() => setActiveMenu("candidates")} />
            <MenuButton icon={<Bell />} label="Notifikasi" badge={unreadNotifCount > 0 ? String(unreadNotifCount) : undefined} isActive={activeMenu === "notifications"} onClick={() => setActiveMenu("notifications")} />
            <MenuButton icon={<User />} label="Profil UMKM" isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
          </nav>
        </div>
        <div className="mt-auto">
          <div className="p-4 rounded-2xl bg-[#F8C662]/10 border border-[#F8C662]/20 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#41644A] text-[#F8C662] flex items-center justify-center font-bold overflow-hidden">
              {photoPreview
                ? <img src={resolveUrl(photoPreview)} alt="foto" className="w-full h-full object-cover" />
                : displayInitials}
            </div>
            <div>
              <p className="text-sm font-bold text-[#2C263F]">{displayName}</p>
              <p className="text-xs text-[#2C263F]/60">Pemilik Aktif</p>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="flex items-center gap-3 w-full p-3 rounded-xl text-[#2C263F]/60 hover:text-red-500 hover:bg-red-50 transition-colors font-medium text-sm">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#2C263F]/10 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover bg-[#2C263F]/5 p-0.5"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
          <div className="hidden w-8 h-8 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-sm">R</div>
          <h1 className="text-lg font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#41644A] text-[#F8C662] flex items-center justify-center font-bold text-sm">{displayInitials}</div>
      </header>

      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12 relative">

        {/* ── HOME ── */}
        {activeMenu === "home" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Halo, {displayName}! 👋</h2>
              <p className="text-[#2C263F]/60">Kelola lowongan dan temukan kandidat terdekat yang paling cocok.</p>
            </header>

            <div className="bg-gradient-to-r from-[#2C263F] to-[#595082] rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#F8C662]" /> Lengkapi Profil UMKM</h3>
                <p className="text-white/80 text-sm max-w-md">Tambahkan lokasi usaha dan kontak agar kandidat mudah menemukan toko kamu.</p>
              </div>
              <button onClick={() => setActiveMenu("profile")} className="relative z-10 whitespace-nowrap bg-[#F8C662] text-[#2C263F] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
                Lengkapi Sekarang
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-[#2C263F]/10 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wide text-[#2C263F]/50 font-bold mb-2">Lowongan Aktif</p>
                <h4 className="text-3xl font-black text-[#41644A]">{myJobs.filter(j => j.is_open).length}</h4>
              </div>
              <div className="bg-white border border-[#2C263F]/10 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wide text-[#2C263F]/50 font-bold mb-2">Total Pelamar</p>
                <h4 className="text-3xl font-black text-[#41644A]">{myJobs.reduce((s, j) => s + (j.applicant_count || 0), 0)}</h4>
              </div>
              <div className="bg-white border border-[#2C263F]/10 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wide text-[#2C263F]/50 font-bold mb-2">Menunggu Review</p>
                <h4 className="text-3xl font-black text-[#41644A]">{pendingCandidates.length}</h4>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2"><Store className="w-6 h-6 text-[#41644A]" /> Lowongan Saya</h3>
              <button onClick={() => setActiveMenu("jobs")} className="text-sm font-bold text-[#41644A] hover:underline">+ Tambah Lowongan</button>
            </div>
            <div className="grid gap-4">
              {myJobs.length > 0 ? myJobs.map((job) => (
                <div key={job.id} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#2C263F]">{job.title}</h4>
                    <p className="text-sm text-[#2C263F]/60">{job.applicant_count || 0} Pelamar</p>
                    {job.requirements && (
                      <p className="text-xs text-[#2C263F]/50 mt-1 max-w-xs truncate">Syarat: {job.requirements}</p>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${job.is_open ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}>
                    {job.is_open ? "Aktif" : "Tutup"}
                  </span>
                </div>
              )) : (
                <div className="text-center py-10 bg-white border border-[#2C263F]/10 rounded-2xl">
                  <p className="text-[#2C263F]/50 text-sm">Belum ada lowongan. <button onClick={() => setActiveMenu("jobs")} className="text-[#41644A] font-bold underline">Buat sekarang</button></p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── BUAT LOWONGAN ── */}
        {activeMenu === "jobs" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Buat Lowongan UMKM 📝</h2>
              <p className="text-[#2C263F]/60">Sistem AI akan otomatis mencocokkan lowongan ini dengan pelamar terdekat.</p>
            </header>
            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={handlePostJob} className="flex flex-col gap-5">
                <InputField label="Nama Posisi (Jabatan)" name="title" icon={<Briefcase className="w-5 h-5" />}
                  placeholder="Contoh: Kasir Toko, Barista, Staff Gudang"
                  value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} />
                <div>
                  <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Estimasi Gaji Bulanan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40"><DollarSign className="w-5 h-5" /></div>
                    <select value={jobForm.salary_range} onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] transition-all font-medium appearance-none">
                      <option value="">Pilih Range Gaji</option>
                      <option value="1">Di bawah Rp 1.500.000</option>
                      <option value="2">Rp 1.500.000 - Rp 2.500.000</option>
                      <option value="3">Rp 2.500.000 - Rp 3.500.000</option>
                      <option value="4">Di atas Rp 3.500.000</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2C263F] mb-2 uppercase tracking-wide opacity-80">Syarat / Skill yang Dibutuhkan</label>
                  <div className="flex flex-wrap gap-2">
                    {["Kasir", "Excel Dasar", "Komunikasi Ramah", "Bongkar Muat", "Punya Motor", "SIM C", "Bisa Masak", "Jujur & Disiplin"].map((skill) => (
                      <label key={skill} className="cursor-pointer">
                        <input type="checkbox" className="peer hidden" checked={jobForm.skills.includes(skill)}
                          onChange={(e) => setJobForm({ ...jobForm, skills: e.target.checked ? [...jobForm.skills, skill] : jobForm.skills.filter(s => s !== skill) })} />
                        <span className="px-4 py-2 rounded-xl text-sm font-bold border border-[#2C263F]/10 text-[#2C263F]/60 peer-checked:bg-[#41644A] peer-checked:text-white peer-checked:border-[#41644A] transition-all block hover:bg-black/5">{skill}</span>
                      </label>
                    ))}
                  </div>
                  {jobForm.skills.length > 0 && (
                    <p className="text-xs text-[#41644A] mt-2 font-medium">Dipilih: {jobForm.skills.join(", ")}</p>
                  )}
                </div>
                {profile.latitude ? (
                  <div className="p-3 bg-[#41644A]/10 rounded-xl border border-[#41644A]/20 text-sm text-[#41644A] font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Lokasi otomatis dari profil UMKM Anda ({parseFloat(profile.latitude).toFixed(4)}, {parseFloat(profile.longitude).toFixed(4)})
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-700 font-medium">
                    ⚠️ Belum ada lokasi di profil. <button type="button" onClick={() => setActiveMenu("profile")} className="underline font-bold">Set lokasi di Profil</button> agar jarak otomatis terhitung.
                  </div>
                )}
                <div className="pt-4 mt-2 border-t border-[#2C263F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[#2C263F]/50 max-w-sm">Lokasi lowongan mengikuti alamat profil UMKM Anda.</p>
                  <button type="submit" disabled={isPostingJob} className={`w-full sm:w-auto px-8 py-4 bg-[#41644A] text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2 ${isPostingJob ? "opacity-50 cursor-not-allowed" : "hover:bg-[#213722]"}`}>
                    <Sparkles className="w-4 h-4" /> {isPostingJob ? "Mempublish..." : "Publish ke Pelamar Sekitar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── KANDIDAT ── */}
        {activeMenu === "candidates" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Manajemen Kandidat 👥</h2>
              <p className="text-[#2C263F]/60">Klik kandidat untuk review CV dan detail lengkap.</p>
            </header>
            {candidates.length > 0 ? (
              <div className="flex flex-col gap-4">
                {candidates.map((c) => (
                  <div key={c.id} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#41644A]/10 text-[#41644A] flex items-center justify-center font-bold text-lg">
                        {(c.full_name || c.email || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2C263F]">{c.full_name || c.email}</h4>
                        <p className="text-sm text-[#2C263F]/60">{c.job_title}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {c.distance_km != null && (
                            <span className="px-2 py-0.5 bg-[#41644A]/10 text-[#41644A] rounded-full text-xs font-bold flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {c.distance_km} km
                            </span>
                          )}
                          {c.match_score && (
                            <span className="px-2 py-0.5 bg-[#41644A]/10 text-[#41644A] rounded-full text-xs font-bold">
                              AI: {Math.round(c.match_score)}%
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.status === "accepted" ? "bg-green-100 text-green-700" : c.status === "rejected" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-700"}`}>
                            {c.status === "pending" ? "Menunggu" : c.status === "reviewed" ? "Ditinjau" : c.status === "accepted" ? "Diterima" : "Ditolak"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedCandidate(c)} className="px-4 py-2 bg-[#41644A] text-white rounded-xl text-sm font-bold hover:bg-[#213722] transition-colors flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Review CV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 border-2 border-green-100">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2C263F] mb-2">Belum Ada Pelamar</h3>
                  <p className="text-[#2C263F]/60 text-sm max-w-md">Pelamar akan muncul di sini setelah jobseeker melamar lowongan Anda.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFIKASI ── */}
        {activeMenu === "notifications" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Notifikasi UMKM 🔔</h2>
              <p className="text-[#2C263F]/60">Kandidat baru yang masuk ke lowongan Anda.</p>
            </header>
            {pendingCandidates.length > 0 ? (
              <div className="flex flex-col gap-4">
                {pendingCandidates.map((c) => (
                  <div key={c.id} onClick={() => setSelectedCandidate(c)} className="bg-white border-2 border-[#2C263F]/5 rounded-2xl p-5 flex gap-4 hover:shadow-md hover:border-[#41644A]/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#41644A]/10 text-[#41644A] flex items-center justify-center shrink-0 font-bold text-lg">
                      {(c.full_name || c.email || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-[#2C263F] text-base">{c.full_name || c.email} melamar!</h4>
                        <div className="w-2 h-2 rounded-full bg-[#41644A] mt-2 shrink-0" />
                      </div>
                      <p className="text-sm text-[#2C263F]/70">
                        Posisi: <b>{c.job_title}</b>
                        {c.distance_km != null && <span className="ml-2 text-[#41644A] font-bold">• {c.distance_km} km dari toko</span>}
                        {c.match_score && <span className="ml-2 text-[#595082] font-bold">• AI {Math.round(c.match_score)}%</span>}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs font-bold text-[#2C263F]/40">{new Date(c.applied_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        {c.cv_url && <span className="text-xs font-bold text-[#41644A]">• CV tersedia</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-10 text-center">
                <Bell className="w-12 h-12 text-[#2C263F]/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#2C263F]">Tidak Ada Notifikasi Baru</h3>
                <p className="text-sm text-[#2C263F]/50 mt-2">Semua pelamar sudah ditinjau.</p>
              </div>
            )}
          </div>
        )}

        {/* ── PROFIL ── */}
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
                    {photoPreview
                      ? <img src={resolveUrl(photoPreview)} alt="foto" className="w-full h-full object-cover" />
                      : <Store className="w-12 h-12 text-[#41644A]" />}
                    <button onClick={() => photoInputRef.current?.click()} disabled={isUploadingPhoto}
                      className="absolute bottom-1 right-1 p-2 bg-[#41644A] rounded-full shadow-md text-white hover:scale-110 transition-transform disabled:opacity-50">
                      <Camera className="w-4 h-4" />
                    </button>
                    <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-[#2C263F]">{displayName}</h3>
                    <p className="text-xs text-[#2C263F]/50">{profile.business_type || "Kategori Bisnis"}</p>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-5">
                  <InputField label="Nama Usaha (UMKM)" name="business_name" icon={<Store className="w-5 h-5" />} value={profile.business_name || ""} onChange={handleProfileChange} />
                  <InputField label="Kategori Bisnis" name="business_type" icon={<Target className="w-5 h-5" />} value={profile.business_type || ""} onChange={handleProfileChange} />
                  <InputField label="Nomor WhatsApp / Telepon" name="phone" type="tel" icon={<Phone className="w-5 h-5" />} value={profile.phone || ""} onChange={handleProfileChange} />
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Alamat Lengkap Toko</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none text-[#2C263F]/40"><MapPin className="w-5 h-5" /></div>
                      <textarea rows="2" name="address" value={profile.address || ""} onChange={handleProfileChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] focus:ring-1 focus:ring-[#F8C662] transition-all" />
                    </div>
                  </div>

                  {/* Lokasi GPS + MapPicker */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Lokasi Toko di Peta</label>
                    <div className="flex items-center justify-between mb-3 p-3 bg-[#FDFBF7] rounded-xl border border-[#2C263F]/10">
                      <p className="text-sm text-[#2C263F]">
                        {profile.latitude
                          ? <span className="text-[#41644A] font-bold">📍 {parseFloat(profile.latitude).toFixed(5)}, {parseFloat(profile.longitude).toFixed(5)}</span>
                          : <span className="text-[#2C263F]/50">Belum diatur. Klik peta atau gunakan GPS.</span>}
                      </p>
                      <button type="button" onClick={handleGetLocation} className="shrink-0 ml-3 px-3 py-2 bg-[#41644A] text-white rounded-lg text-xs font-bold hover:bg-[#213722] transition-colors flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" /> GPS
                      </button>
                    </div>
                    <MapPicker
                      initialAddress={profile.address || ''}
                      onLocationSelect={(lat, lng) => setProfile((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
                      onAddressFound={(addr) => setProfile((prev) => ({ ...prev, address: addr }))}
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button onClick={handleSaveProfile} disabled={isSaving} className={`px-8 py-3.5 bg-[#41644A] text-white rounded-xl font-bold shadow-md transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-[#213722]"}`}>
                      {isSaving ? "Menyimpan..." : "Simpan Profil"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

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