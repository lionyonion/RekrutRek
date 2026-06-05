// components/ProtectedRoute.jsx
// Taruh file ini di: src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth()

  // Tunggu proses cek token selesai dulu sebelum memutuskan redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#41644A] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#2C263F]/60 font-medium text-sm">Memuat...</p>
        </div>
      </div>
    )
  }

  // Belum login sama sekali
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Role tidak sesuai (opsional — aktifkan kalau butuh role-based guard)
  if (allowedRole && user.user_type !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}
