// ==========================================
// THEME & ROLE CONFIGURATION
// ==========================================

export const theme = {
  appBg: "linear-gradient(180deg, #2C263F 0%, #15121F 100%)",
  card: "rgba(89, 80, 130, 0.25)",
  border: "rgba(248, 198, 98, 0.2)",
  text: "#FDFBF7",
  muted: "rgba(253, 251, 247, 0.65)",
  pill: "rgba(248, 198, 98, 0.15)",
  rekColor: "#F8C662",
  rekrutColor: "#41644A",
  corporateColor: "#595082",
};

export const roleConfig = {
  jobseeker: {
    id: "jobseeker",
    title: "Pelamar",
    color: "#41644A",
    loginDesc: "Cari dan lamar pekerjaan impianmu.",
    registerDesc: "Daftar sekarang untuk menemukan lowongan yang sesuai.",
  },
  umkm: {
    id: "umkm",
    title: "UMKM",
    color: "#F8C662",
    loginDesc: "Kelola rekrutmen karyawan lokal untuk usahamu.",
    registerDesc: "Buat akun UMKM untuk mulai mencari kandidat.",
  },
  corporate: {
    id: "corporate",
    title: "Corporate",
    color: "#595082",
    loginDesc: "Akses sistem AI screening untuk perusahaanmu.",
    registerDesc: "Daftarkan perusahaanmu untuk rekrutmen profesional.",
  },
};