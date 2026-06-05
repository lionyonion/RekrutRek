import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Building2, Home, Search, Cpu, Bell, User, LogOut,
  Bookmark, MapPin, Mail, Camera, Briefcase, Users, FileText,
  ExternalLink, Navigation, X, Store,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { MenuButton, MobileMenuButton, InputField } from "../components/SharedUI";
import MapPicker from "../components/MapPicker";
import { profileService, jobService, applicationService } from "../services/api";

// Modal review CV kandidat corporate
function ApplicantModal({ applicant, onClose, onStatusChange }) {
  if (!applicant) return null;
  const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C263F]/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#2C263F]/10 flex items-center justify-between bg-[#FDFBF7]">
          <h3 className="font-bold text-lg text-[#2C263F]">Review Pelamar</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#2C263F]/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-[#2C263F]/60" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#595082]/10 text-[#595082] flex items-center justify-center font-bold text-xl">
              {(applicant.full_name || applicant.email || "?")[0].toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#2C263F]">{applicant.full_name || "—"}</h4>
              <p className="text-sm text-[#2C263F]/60">{applicant.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FDFBF7] rounded-xl p-3 border border-[#2C263F]/5">
              <p className="text-[10px] font-bold uppercase text-[#2C263F]/50 mb-1">Posisi</p>
              <p className="text-sm font-bold text-[#2C263F]">{applicant.job_title}</p>
            </div>
            {applicant.phone && (
              <div className="bg-[#FDFBF7] rounded-xl p-3 border border-[#2C263F]/5">
                <p className="text-[10px] font-bold uppercase text-[#2C263F]/50 mb-1">Telepon</p>
                <p className="text-sm font-bold text-[#2C263F]">{applicant.phone}</p>
              </div>
            )}
            {applicant.salary_expect && (
              <div className="bg-[#FDFBF7] rounded-xl p-3 border border-[#2C263F]/5">
                <p className="text-[10px] font-bold uppercase text-[#2C263F]/50 mb-1">Ekspektasi Gaji</p>
                <p className="text-sm font-bold text-[#2C263F]">Rp {Number(applicant.salary_expect).toLocaleString("id-ID")}</p>
              </div>
            )}
            {applicant.match_score && (
              <div className="bg-[#595082]/10 rounded-xl p-3 border border-[#595082]/20">
                <p className="text-[10px] font-bold uppercase text-[#595082]/70 mb-1">AI Score</p>
                <p className="text-sm font-bold text-[#595082]">{Math.round(applicant.match_score)}% Match</p>
              </div>
            )}
            {applicant.distance_km != null && (
              <div className="bg-[#FDFBF7] rounded-xl p-3 border border-[#2C263F]/5">
                <p className="text-[10px] font-bold uppercase text-[#2C263F]/50 mb-1">Jarak dari Kantor</p>
                <p className="text-sm font-bold text-[#2C263F]">{applicant.distance_km} km</p>
              </div>
            )}
          </div>

          {applicant.cv_url ? (
            <a
              href={`${API_BASE}${applicant.cv_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#595082] text-white rounded-xl font-bold text-sm hover:bg-[#2C263F] transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Buka CV (PDF)
            </a>
          ) : (
            <div className="text-center py-3 bg-[#2C263F]/5 rounded-xl text-sm text-[#2C263F]/50 font-medium">
              Pelamar belum mengupload CV
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-[#2C263F]/10">
            <button onClick={() => onStatusChange(applicant.id, "accepted")}
              className="flex-1 py-3 bg-[#595082] text-white rounded-xl font-bold text-sm hover:bg-[#2C263F] transition-colors">Terima</button>
            <button onClick={() => onStatusChange(applicant.id, "reviewed")}
              className="flex-1 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors">Lanjut Review</button>
            <button onClick={() => onStatusChange(applicant.id, "rejected")}
              className="flex-1 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">Tolak</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD: Corporate
// ==========================================
export default function CorporateDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const photoInputRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

  const [profile, setProfile] = useState({
    company_name: "", industry: "", address: "", hrd_name: "", company_size: "",
    latitude: null, longitude: null, photo_url: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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
    if (!name) return "CP";
    const names = name.trim().split(" ");
    return names.length >= 2 ? (names[0][0] + names[1][0]).toUpperCase() : names[0].substring(0, 2).toUpperCase();
  };

  const displayName = profile.company_name || 'Perusahaan';
  const displayInitials = getInitials(displayName);

  const [myJobs, setMyJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [jobForm, setJobForm] = useState({ title: "", dept: "", work_type: "wfo", requirements: "" });
  const [isPostingJob, setIsPostingJob] = useState(false);

  useEffect(() => {
    jobService.getMy().then((res) => setMyJobs(res.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeMenu === "screening" || activeMenu === "notifications") {
      applicationService.getForMyJobs().then((res) => setApplicants(res.data || [])).catch(console.error);
    }
  }, [activeMenu]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title) return alert("Job title wajib diisi.");
    setIsPostingJob(true);
    try {
      await jobService.create({
        title: jobForm.title,
        description: jobForm.dept,
        requirements: jobForm.requirements,
        latitude: profile.latitude,
        longitude: profile.longitude,
        address: profile.address,
      });
      alert("Lowongan berhasil dipublish! AI Screening diaktifkan.");
      setJobForm({ title: "", dept: "", work_type: "wfo", requirements: "" });
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
      setApplicants(res.data || []);
      setSelectedApplicant(null);
    } catch {
      alert("Gagal memperbarui status.");
    }
  };

  const pendingApplicants = applicants.filter((a) => a.status === "pending");
  const topApplicants = [...applicants]
    .filter((a) => a.match_score)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 4);

  const stats = [
    { label: "Lowongan Aktif", value: myJobs.filter(j => j.is_open).length },
    { label: "Total Pelamar", value: myJobs.reduce((s, j) => s + (j.applicant_count || 0), 0) },
    { label: "Menunggu Review", value: pendingApplicants.length },
  ];

  const pipeline = [
    { stage: "Applied",    count: applicants.length },
    { stage: "Screening",  count: applicants.filter(a => a.status === "reviewed").length },
    { stage: "Interview",  count: applicants.filter(a => a.status === "accepted").length },
    { stage: "Rejected",   count: applicants.filter(a => a.status === "rejected").length },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex flex-col md:flex-row selection:bg-[#F8C662] selection:text-[#2C263F]">
      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onStatusChange={handleStatusChange}
        />
      )}

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
            <MenuButton icon={<Cpu />} label="AI Screening" badge={applicants.length > 0 ? String(applicants.length) : undefined} isActive={activeMenu === "screening"} onClick={() => setActiveMenu("screening")} />
            <MenuButton icon={<Bell />} label="Notifikasi" badge={pendingApplicants.length > 0 ? String(pendingApplicants.length) : undefined} isActive={activeMenu === "notifications"} onClick={() => setActiveMenu("notifications")} />
            <MenuButton icon={<User />} label="Profil Perusahaan" isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
          </nav>
        </div>
        <div className="mt-auto">
          <div className="p-4 rounded-2xl bg-[#595082]/10 border border-[#595082]/20 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#595082] text-[#F8C662] flex items-center justify-center font-bold overflow-hidden">
              {photoPreview
                ? <img src={photoPreview.startsWith("blob:") ? photoPreview : `${API_BASE}${photoPreview}`} alt="foto" className="w-full h-full object-cover" />
                : displayInitials}
            </div>
            <div>
              <p className="text-sm font-bold text-[#2C263F]">{displayName}</p>
              <p className="text-xs text-[#2C263F]/60">Corporate HR</p>
            </div>
          </div>
          <button onClick={() => navigate("/")} className="flex items-center gap-3 w-full p-3 rounded-xl text-[#2C263F]/60 hover:text-red-500 hover:bg-red-50 transition-colors font-medium text-sm">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#2C263F]/10 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
          <div className="hidden w-8 h-8 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-sm">R</div>
          <h1 className="text-lg font-bold tracking-tight text-[#2C263F]">Rekrut<span className="text-[#F8C662]">Rek</span></h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#595082] text-[#F8C662] flex items-center justify-center font-bold text-sm">{displayInitials}</div>
      </header>

      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12 relative">

        {/* ── HOME ── */}
        {activeMenu === "home" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">{displayName} 👋</h2>
              <p className="text-[#2C263F]/60">Pantau proses screening, ranking kandidat, dan pipeline rekrutmen.</p>
            </header>

            <div className="bg-gradient-to-r from-[#2C263F] to-[#595082] rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Cpu className="w-5 h-5 text-[#F8C662]" /> AI Screening Aktif</h3>
                <p className="text-white/80 text-sm max-w-md">CV kandidat diproses otomatis. {pendingApplicants.length} pelamar baru menunggu review.</p>
              </div>
              <button onClick={() => setActiveMenu("screening")} className="relative z-10 whitespace-nowrap bg-[#F8C662] text-[#2C263F] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all">
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

            {/* Top candidates from API */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2"><FileText className="w-6 h-6 text-[#595082]" /> Kandidat Terbaik</h3>
              <button onClick={() => setActiveMenu("screening")} className="text-sm font-bold text-[#595082] hover:underline">Lihat Semua</button>
            </div>
            {topApplicants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                {topApplicants.map((a) => (
                  <div key={a.id} onClick={() => setSelectedApplicant(a)} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 hover:shadow-xl hover:border-[#595082]/30 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-[#2C263F] group-hover:text-[#595082] transition-colors">{a.full_name || a.email}</h4>
                        <p className="text-sm text-[#2C263F]/60 font-medium">{a.job_title}</p>
                      </div>
                      <Bookmark className="w-5 h-5 text-[#2C263F]/30 hover:text-[#F8C662] transition-colors" />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {a.match_score && (
                        <span className="px-3 py-1 bg-[#595082]/10 text-[#595082] rounded-full text-xs font-bold flex items-center gap-1">
                          <Target className="w-3 h-3" /> {Math.round(a.match_score)}% Score
                        </span>
                      )}
                      {a.distance_km != null && (
                        <span className="px-3 py-1 bg-[#2C263F]/5 text-[#2C263F]/70 rounded-full text-xs font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {a.distance_km} km
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.status === "accepted" ? "bg-green-100 text-green-700" : a.status === "reviewed" ? "bg-blue-100 text-blue-600" : "bg-[#2C263F]/5 text-[#2C263F]/60"}`}>
                        {a.status === "pending" ? "Baru Masuk" : a.status === "reviewed" ? "Ditinjau" : a.status === "accepted" ? "Diterima" : "Ditolak"}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-[#2C263F]/10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#2C263F]/50 font-bold uppercase">Rekomendasi AI</p>
                        <p className="text-sm font-black text-[#595082]">{a.match_score >= 80 ? "Sangat Cocok" : "Cukup Cocok"}</p>
                      </div>
                      <button className="px-4 py-2 bg-[#595082] text-[#FDFBF7] rounded-lg text-sm font-bold shadow-md hover:bg-[#2C263F] transition-colors flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Buka CV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#2C263F]/10 rounded-2xl p-8 text-center mb-10">
                <Users className="w-10 h-10 text-[#2C263F]/20 mx-auto mb-3" />
                <p className="text-[#2C263F]/50 text-sm">Belum ada pelamar dengan AI score. Buat lowongan terlebih dahulu.</p>
              </div>
            )}

            {/* Pipeline */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C263F] flex items-center gap-2"><Users className="w-6 h-6 text-[#595082]" /> Pipeline Rekrutmen</h3>
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

        {/* ── POSTING LOWONGAN ── */}
        {activeMenu === "jobs" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Posting Lowongan Profesional 📝</h2>
              <p className="text-[#2C263F]/60">Jabarkan kualifikasi dengan detail. AI akan menggunakannya untuk men-screening CV pelamar.</p>
            </header>

            {/* My Jobs list */}
            {myJobs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#2C263F] mb-4">Lowongan Aktif</h3>
                <div className="flex flex-col gap-3">
                  {myJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-[#2C263F]/10 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[#2C263F]">{job.title}</h4>
                        <p className="text-xs text-[#2C263F]/60 mt-0.5">{job.applicant_count || 0} pelamar</p>
                        {job.requirements && (
                          <p className="text-xs text-[#2C263F]/50 mt-1 max-w-sm truncate">Syarat: {job.requirements}</p>
                        )}
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${job.is_open ? "bg-green-50 text-green-700 border border-green-200" : "bg-orange-50 text-orange-700 border border-orange-200"}`}>
                        {job.is_open ? "Aktif" : "Tutup"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-[#2C263F] mb-5">Buat Lowongan Baru</h3>
              <form onSubmit={handlePostJob} className="flex flex-col gap-5">
                <InputField label="Job Title" name="title" icon={<Briefcase className="w-5 h-5" />} placeholder="e.g. Senior Frontend Developer"
                  value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Departemen" name="dept" icon={<Building2 className="w-5 h-5" />} placeholder="e.g. Engineering / Marketing"
                    value={jobForm.dept} onChange={(e) => setJobForm({ ...jobForm, dept: e.target.value })} />
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Tipe Pekerjaan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40"><MapPin className="w-5 h-5" /></div>
                      <select value={jobForm.work_type} onChange={(e) => setJobForm({ ...jobForm, work_type: e.target.value })} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] transition-all font-medium appearance-none">
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
                    <textarea rows="4" value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                      placeholder={"- Minimal S1 Teknik Informatika\n- Menguasai React.js dan Node.js\n- Pengalaman minimal 3 tahun"}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] transition-all placeholder:text-[#2C263F]/30 leading-relaxed" />
                  </div>
                </div>
                {profile.latitude ? (
                  <div className="p-3 bg-[#595082]/10 rounded-xl border border-[#595082]/20 text-sm text-[#595082] font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Lokasi dari profil perusahaan ({parseFloat(profile.latitude).toFixed(4)}, {parseFloat(profile.longitude).toFixed(4)})
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-700 font-medium">
                    ⚠️ Set lokasi kantor di <button type="button" onClick={() => setActiveMenu("profile")} className="underline font-bold">Profil Perusahaan</button>.
                  </div>
                )}
                <div className="pt-4 mt-2 border-t border-[#2C263F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
                    <Cpu className="w-3.5 h-3.5" /> Auto AI-Screening ON
                  </div>
                  <button type="submit" disabled={isPostingJob} className={`w-full sm:w-auto px-8 py-4 bg-[#595082] text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2 ${isPostingJob ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2C263F]"}`}>
                    <Target className="w-4 h-4" /> {isPostingJob ? "Mempublish..." : "Publish & Aktifkan AI"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── AI SCREENING ── */}
        {activeMenu === "screening" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Panel AI Screening 🤖</h2>
              <p className="text-[#2C263F]/60">Pelamar diurutkan berdasarkan skor AI. Klik untuk review CV dan detail.</p>
            </header>
            {applicants.length > 0 ? (
              <div className="flex flex-col gap-4">
                {[...applicants].sort((a, b) => (b.match_score || 0) - (a.match_score || 0)).map((a) => (
                  <div key={a.id} className="bg-white border border-[#2C263F]/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#595082]/10 text-[#595082] flex items-center justify-center font-bold text-lg">
                        {(a.full_name || a.email || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2C263F]">{a.full_name || a.email}</h4>
                        <p className="text-sm text-[#2C263F]/60">{a.job_title}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {a.match_score && (
                            <span className="px-2 py-0.5 bg-[#595082]/10 text-[#595082] rounded-full text-xs font-bold">
                              AI: {Math.round(a.match_score)}%
                            </span>
                          )}
                          {a.distance_km != null && (
                            <span className="px-2 py-0.5 bg-[#2C263F]/5 text-[#2C263F]/60 rounded-full text-xs font-bold flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {a.distance_km} km
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.status === "accepted" ? "bg-green-100 text-green-700" : a.status === "rejected" ? "bg-red-100 text-red-600" : a.status === "reviewed" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
                            {a.status === "pending" ? "Baru Masuk" : a.status === "reviewed" ? "Ditinjau" : a.status === "accepted" ? "Diterima" : "Ditolak"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedApplicant(a)} className="shrink-0 px-4 py-2 bg-[#595082] text-white rounded-xl text-sm font-bold hover:bg-[#2C263F] transition-colors flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Review CV
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#2C263F]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4 border-2 border-purple-100">
                    <Cpu className="w-10 h-10 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2C263F] mb-2">Belum Ada Pelamar</h3>
                  <p className="text-[#2C263F]/60 text-sm">Pelamar akan muncul di sini setelah jobseeker melamar lowongan Anda.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFIKASI ── */}
        {activeMenu === "notifications" && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <header className="mb-10">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">Notifikasi Corporate 🔔</h2>
              <p className="text-[#2C263F]/60">Pelamar baru yang masuk dan menunggu review AI screening.</p>
            </header>
            {pendingApplicants.length > 0 ? (
              <div className="flex flex-col gap-4">
                {pendingApplicants.map((a) => (
                  <div key={a.id} onClick={() => setSelectedApplicant(a)} className="bg-white border-2 border-[#2C263F]/5 rounded-2xl p-5 flex gap-4 hover:shadow-md hover:border-[#595082]/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#595082]/10 text-[#595082] flex items-center justify-center shrink-0 font-bold text-lg">
                      {(a.full_name || a.email || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-[#2C263F] text-base">{a.full_name || a.email} melamar!</h4>
                        <div className="w-2 h-2 rounded-full bg-[#595082] mt-2 shrink-0" />
                      </div>
                      <p className="text-sm text-[#2C263F]/70">
                        Posisi: <b>{a.job_title}</b>
                        {a.match_score && <span className="ml-2 text-[#595082] font-bold">• AI {Math.round(a.match_score)}%</span>}
                        {a.distance_km != null && <span className="ml-2 text-[#2C263F]/60 font-bold">• {a.distance_km} km</span>}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs font-bold text-[#2C263F]/40">{new Date(a.applied_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        {a.cv_url && <span className="text-xs font-bold text-[#595082]">• CV tersedia</span>}
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

        {/* ── PROFIL PERUSAHAAN ── */}
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
                    {photoPreview
                      ? <img src={photoPreview.startsWith("blob:") ? photoPreview : `${API_BASE}${photoPreview}`} alt="foto" className="w-full h-full object-cover" />
                      : <Building2 className="w-12 h-12" />}
                    <button onClick={() => photoInputRef.current?.click()} disabled={isUploadingPhoto}
                      className="absolute bottom-1 right-1 p-2 bg-[#595082] rounded-full shadow-md text-white hover:scale-110 transition-transform disabled:opacity-50">
                      <Camera className="w-4 h-4" />
                    </button>
                    <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-[#2C263F]">{displayName}</h3>
                    <p className="text-xs text-[#2C263F]/50">{profile.industry || "Industri Belum Diatur"}</p>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-5">
                  <InputField label="Nama Perusahaan" name="company_name" icon={<Building2 className="w-5 h-5" />} value={profile.company_name || ""} onChange={handleProfileChange} />
                  <InputField label="Industri" name="industry" icon={<Target className="w-5 h-5" />} value={profile.industry || ""} onChange={handleProfileChange} />
                  <InputField label="Email HR / Rekrutmen" name="email" type="email" icon={<Mail className="w-5 h-5" />} value={user?.email || ""} disabled />
                  <InputField label="Nama HRD / PIC" name="hrd_name" icon={<User className="w-5 h-5" />} value={profile.hrd_name || ""} onChange={handleProfileChange} />
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Ukuran Perusahaan</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/40"><Users className="w-5 h-5" /></div>
                      <select name="company_size" value={profile.company_size || ""} onChange={handleProfileChange} className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] transition-all font-medium appearance-none">
                        <option value="">Pilih Ukuran</option>
                        <option value="1-50">1 - 50 karyawan</option>
                        <option value="51-200">51 - 200 karyawan</option>
                        <option value="201-500">201 - 500 karyawan</option>
                        <option value="500+">500+ karyawan</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Alamat Kantor Pusat</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 pt-3.5 pointer-events-none text-[#2C263F]/40"><MapPin className="w-5 h-5" /></div>
                      <textarea rows="2" name="address" value={profile.address || ""} onChange={handleProfileChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#F8C662] focus:ring-1 focus:ring-[#F8C662] transition-all" />
                    </div>
                  </div>

                  {/* Lokasi GPS + MapPicker */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide opacity-80">Lokasi Kantor di Peta</label>
                    <div className="flex items-center justify-between mb-3 p-3 bg-[#FDFBF7] rounded-xl border border-[#2C263F]/10">
                      <p className="text-sm text-[#2C263F]">
                        {profile.latitude
                          ? <span className="text-[#595082] font-bold">📍 {parseFloat(profile.latitude).toFixed(5)}, {parseFloat(profile.longitude).toFixed(5)}</span>
                          : <span className="text-[#2C263F]/50">Belum diatur. Klik peta atau gunakan GPS.</span>}
                      </p>
                      <button type="button" onClick={handleGetLocation} className="shrink-0 ml-3 px-3 py-2 bg-[#595082] text-white rounded-lg text-xs font-bold hover:bg-[#2C263F] transition-colors flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" /> GPS
                      </button>
                    </div>
                    <MapPicker
                      onLocationSelect={(lat, lng) => setProfile((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button onClick={handleSaveProfile} disabled={isSaving} className={`px-8 py-3.5 bg-[#595082] text-white rounded-xl font-bold shadow-md transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2C263F]"}`}>
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
          <MobileMenuButton icon={<Search />} label="Lowongan" isActive={activeMenu === "jobs"} onClick={() => setActiveMenu("jobs")} />
          <MobileMenuButton icon={<Cpu />} label="AI" isActive={activeMenu === "screening"} onClick={() => setActiveMenu("screening")} />
          <MobileMenuButton icon={<Bell />} label="Notif" isActive={activeMenu === "notifications"} onClick={() => setActiveMenu("notifications")} />
          <MobileMenuButton icon={<User />} label="Profil" isActive={activeMenu === "profile"} onClick={() => setActiveMenu("profile")} />
        </div>
      </nav>
    </div>
  );
}