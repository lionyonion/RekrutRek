import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  Store,
  Building2,
  CheckCircle,
} from "lucide-react";

// Sesuaikan path import ini jika berbeda
import { roleConfig } from "../constants/theme";
import { InputField } from "../components/SharedUI";
import { useAuth } from "../hooks/useAuth"; // <-- WAJIB IMPORT INI

// ==========================================
// PAGE: AuthPage (Login & Register)
// ==========================================
export default function AuthPage({ isLogin }) {
  const navigate = useNavigate();
  const { roleId } = useParams();
  
  // Mengambil fungsi login dan register dari context (api.js)
  const { login, register } = useAuth();

  const role = roleConfig[roleId];
  if (!role)
    return (
      <div className="p-10 text-center">
        Role tidak valid. <Link to="/">Kembali</Link>
      </div>
    );

  const [formData, setFormData] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const { email, password, confirmPassword, ...otherData } = formData;

    try {
      if (isLogin) {
        // --- LOGIN MENGGUNAKAN USEAUTH ---
        const loggedInUser = await login(email, password);
        
        if (loggedInUser.user_type !== roleId) {
          setErrorMsg(`Akses ditolak! Akun ini terdaftar sebagai ${loggedInUser.user_type}, bukan ${roleId}.`);
          setIsLoading(false);
          return; 
        }
      } else {
        await register(email, password, roleId, otherData);
      }

      setIsSuccess(true);
      setTimeout(() => navigate(`/dashboard/${roleId}`), 1500);
    } catch (error) {
      // Tangkap pesan error dari backend
      const pesan = error.response?.data?.error || error.message || "Gagal memproses permintaan.";
      setErrorMsg(pesan);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    if (isLogin) navigate(`/register/${roleId}`);
    else navigate(`/login/${roleId}`);
  };

  const roleIcons = {
    jobseeker: <User className="w-6 h-6" />,
    umkm: <Store className="w-6 h-6" />,
    corporate: <Building2 className="w-6 h-6" />,
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-[#F8C662] selection:text-[#2C263F]">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-5/12 text-white p-12 flex-col justify-between relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #2C263F 0%, #15121F 100%)" }}
      >
        <div
          className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-50 pointer-events-none"
          style={{ background: role.color }}
        />

        <div
          className="relative z-10 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-10 h-10 rounded-lg object-cover bg-white/5 p-1"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">
            R
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Rekrut<span className="text-[#F8C662]">Rek</span>
          </h1>
        </div>

        <div className="relative z-10 my-auto">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 border-2"
            style={{
              background: role.color + "30",
              borderColor: role.color,
              color: role.color,
            }}
          >
            {roleIcons[roleId]}
          </div>
          <h2 className="text-5xl font-black leading-[1.15] mb-6">
            Portal <br />
            <span style={{ color: "#F8C662" }}>{role.title}</span>.
          </h2>
          <p className="text-lg text-white/70 max-w-sm leading-relaxed">
            {isLogin ? role.loginDesc : role.registerDesc}
          </p>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-7/12 bg-[#FDFBF7] overflow-y-auto relative">
        <div className="min-h-full flex flex-col p-6 sm:p-12 lg:px-24">
          <div className="mb-12">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm font-bold text-[#2C263F]/60 hover:text-[#2C263F] transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Utama
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto pb-12">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-3 mb-10">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-10 h-10 rounded-lg object-cover bg-[#2C263F]/5 p-1"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="hidden w-10 h-10 rounded-lg items-center justify-center font-black bg-[#41644A] text-[#F8C662] text-xl">
                R
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#2C263F]">
                Rekrut<span className="text-[#F8C662]">Rek</span>
              </h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-[#2C263F] mb-2">
                {isLogin ? "Selamat Datang" : "Buat Akun Baru"}
              </h2>
              <p className="text-[#2C263F]/60 text-sm flex items-center gap-2">
                Sebagai{" "}
                <span
                  className="font-bold px-2 py-1 rounded text-white text-xs"
                  style={{ background: role.color }}
                >
                  {role.title}
                </span>
              </p>
            </div>

            {/* Menampilkan kotak error merah jika ada kesalahan login/register */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm font-semibold rounded-r-lg">
                {errorMsg}
              </div>
            )}

            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex flex-col items-center text-center">
                <CheckCircle className="w-12 h-12 mb-3 text-green-500" />
                <h3 className="font-bold text-lg mb-1">Berhasil!</h3>
                <p className="text-sm opacity-80">Mengarahkan ke Dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Jobseeker register fields */}
                {!isLogin && roleId === "jobseeker" && (
                  <InputField
                    label="Nama Lengkap"
                    name="nama"
                    icon={<User className="w-5 h-5" />}
                    onChange={handleInputChange}
                  />
                )}

                {/* UMKM register fields */}
                {!isLogin && roleId === "umkm" && (
                  <>
                    <InputField
                      label="Nama PIC"
                      name="namaPic"
                      icon={<User className="w-5 h-5" />}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Nama UMKM"
                      name="namaUmkm"
                      icon={<Store className="w-5 h-5" />}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Nomor WhatsApp"
                      name="whatsapp"
                      type="tel"
                      icon={<Phone className="w-5 h-5" />}
                      onChange={handleInputChange}
                    />
                  </>
                )}

                {/* Corporate register fields */}
                {!isLogin && roleId === "corporate" && (
                  <>
                    <InputField
                      label="Nama PIC HR"
                      name="namaPicHr"
                      icon={<User className="w-5 h-5" />}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Nama Perusahaan"
                      name="namaPerusahaan"
                      icon={<Building2 className="w-5 h-5" />}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Nomor WhatsApp PIC"
                      name="whatsapp"
                      type="tel"
                      icon={<Phone className="w-5 h-5" />}
                      onChange={handleInputChange}
                    />
                  </>
                )}

                <InputField
                  label={
                    !isLogin && roleId === "corporate"
                      ? "Email Perusahaan"
                      : "Email"
                  }
                  name="email"
                  type="email"
                  icon={<Mail className="w-5 h-5" />}
                  onChange={handleInputChange}
                />

                <div className="relative">
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    icon={<Lock className="w-5 h-5" />}
                    onChange={handleInputChange}
                  />
                  {isLogin && (
                    <div className="absolute -bottom-6 right-0">
                      <a
                        href="#"
                        className="text-xs font-bold hover:underline transition-colors"
                        style={{ color: role.color }}
                      >
                        Lupa password?
                      </a>
                    </div>
                  )}
                </div>

                {!isLogin && roleId === "jobseeker" && (
                  <InputField
                    label="Konfirmasi Password"
                    name="confirmPassword"
                    type="password"
                    icon={<Lock className="w-5 h-5" />}
                    onChange={handleInputChange}
                  />
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-8 py-4 rounded-xl font-bold text-white transition-transform ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                  style={{
                    background: `linear-gradient(135deg, ${role.color}, #15121F)`,
                    boxShadow: `0 10px 20px ${role.color}30`,
                  }}
                >
                  {isLoading ? "Memproses..." : (isLogin ? "Masuk" : "Daftar")}
                </button>

                <div className="text-center mt-4 text-sm text-[#2C263F]/60 font-medium">
                  {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="font-bold hover:underline"
                    style={{ color: role.color }}
                  >
                    {isLogin ? "Daftar di sini" : "Masuk di sini"}
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