import { useState } from "react";
import {
  Sparkles,
  Cpu,
  UploadCloud,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";

// ==========================================
// COMPONENT: JobApplyModal (Jobseeker)
// ==========================================
export function JobApplyModal({ job, onClose }) {
  const [step, setStep] = useState("form");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [expectedSalary, setExpectedSalary] = useState("");

  const umkmSkills = [
    "Kasir",
    "Excel",
    "Komunikasi",
    "Customer Service",
    "Disiplin",
    "Bawa Motor",
  ];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleProcess = () => {
    setStep("analyzing");
    setTimeout(() => setStep("result"), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C263F]/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2C263F]/10 flex items-center justify-between bg-[#FDFBF7] shrink-0">
          <div>
            <h3 className="font-bold text-lg text-[#2C263F] flex items-center gap-2">
              {job.type === "umkm" ? "Tertarik dengan UMKM" : "Apply Corporate"}
            </h3>
            <p className="text-sm text-[#2C263F]/60">
              {job.title} - {job.company}
            </p>
          </div>
          {step !== "analyzing" && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2C263F]/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#2C263F]/60" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {/* STEP: Form */}
          {step === "form" && (
            <div className="flex flex-col gap-6">
              {job.type === "umkm" ? (
                <>
                  <div className="bg-[#41644A]/10 border border-[#41644A]/20 p-4 rounded-xl flex gap-3">
                    <Sparkles className="w-5 h-5 text-[#41644A] shrink-0" />
                    <p className="text-sm text-[#2C263F] font-medium">
                      Sistem kami menggunakan <b>Mutual Match</b>. Isi skill dan
                      ekspektasi gaji Anda di bawah. Jika UMKM cocok, kontak
                      akan saling dibagikan.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-3 uppercase tracking-wide">
                      Pilih Skill yang Kamu Kuasai
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {umkmSkills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                            selectedSkills.includes(skill)
                              ? "bg-[#41644A] text-white border-[#41644A]"
                              : "bg-white text-[#2C263F]/70 border-[#2C263F]/20 hover:border-[#41644A]/50"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-1.5 uppercase tracking-wide">
                      Expected Salary (Gaji yang Diharapkan)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#2C263F]/50 font-bold">
                        Rp
                      </div>
                      <input
                        type="number"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        placeholder="Contoh: 2500000"
                        className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#FDFBF7] border border-[#2C263F]/10 text-[#2C263F] focus:outline-none focus:border-[#41644A] focus:ring-1 focus:ring-[#41644A] transition-all font-bold"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#595082]/10 border border-[#595082]/20 p-4 rounded-xl flex gap-3">
                    <Cpu className="w-5 h-5 text-[#595082] shrink-0" />
                    <p className="text-sm text-[#2C263F] font-medium">
                      AI akan mengekstrak CV Anda otomatis untuk mencocokkan
                      kualifikasi dengan posisi <b>{job.title}</b>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C263F] mb-2 uppercase tracking-wide">
                      Upload CV Terbaru (PDF)
                    </label>
                    <div className="border-2 border-dashed border-[#595082]/30 rounded-2xl p-10 flex flex-col items-center justify-center bg-[#FDFBF7] hover:bg-[#595082]/5 cursor-pointer transition-colors group">
                      <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-[#595082]/10">
                        <UploadCloud className="w-7 h-7 text-[#595082]" />
                      </div>
                      <p className="text-base font-bold text-[#2C263F]">
                        Klik untuk memilih file CV
                      </p>
                      <p className="text-xs text-[#2C263F]/50 mt-1">
                        Maksimal ukuran file 5MB
                      </p>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleProcess}
                disabled={
                  job.type === "umkm"
                    ? selectedSkills.length === 0 || !expectedSalary
                    : false
                }
                className={`w-full py-4 rounded-xl font-bold text-white transition-transform hover:-translate-y-1 shadow-lg mt-2 ${
                  job.type === "umkm"
                    ? "bg-[#41644A] disabled:bg-gray-300"
                    : "bg-[#595082]"
                }`}
              >
                {job.type === "umkm"
                  ? "Submit & Cek Kecocokan AI"
                  : "Upload & Ekstrak CV"}
              </button>
            </div>
          )}

          {/* STEP: Analyzing */}
          {step === "analyzing" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-8">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    job.type === "umkm"
                      ? "bg-[#41644A]/10 text-[#41644A]"
                      : "bg-[#595082]/10 text-[#595082]"
                  }`}
                >
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                <div
                  className="absolute inset-0 rounded-full animate-ping border-4 border-current opacity-20"
                  style={{ color: job.type === "umkm" ? "#41644A" : "#595082" }}
                />
              </div>
              <h3 className="text-xl font-black text-[#2C263F] mb-2">
                {job.type === "umkm"
                  ? "AI Sedang Menghitung..."
                  : "AI Mengekstrak CV..."}
              </h3>
              <p className="text-[#2C263F]/60 text-sm max-w-[250px]">
                {job.type === "umkm"
                  ? "Mengolah data skill, jarak lokasi, dan ekspektasi gaji Anda."
                  : "Membaca pengalaman, skill, dan pendidikan dari dokumen Anda."}
              </p>
            </div>
          )}

          {/* STEP: Result */}
          {step === "result" && (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-[#2C263F] mb-2">
                Berhasil Terkirim!
              </h3>
              <div className="bg-[#FDFBF7] border border-[#2C263F]/10 rounded-xl p-4 mb-6 w-full">
                <p className="text-xs font-bold text-[#2C263F]/50 uppercase mb-1">
                  Hasil Analisis AI
                </p>
                <p className="text-3xl font-black text-[#41644A]">Skor: 94%</p>
                <p className="text-sm text-[#2C263F]/70 mt-2">
                  {job.type === "umkm"
                    ? "Profil Anda sangat cocok! Menunggu pihak UMKM melakukan review."
                    : "CV berhasil diekstrak dan masuk ke dalam top ranking pelamar."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 rounded-xl font-bold text-[#2C263F] bg-[#F8C662] hover:bg-[#e5b658] transition-colors"
              >
                Tutup & Kembali
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}