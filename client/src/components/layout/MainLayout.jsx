import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// Tentukan link navigasi berdasarkan tipe user
const NAV_LINKS = {
  jobseeker: [
    { to: '/',                 label: 'Cari Kerja' },
    { to: '/dashboard',        label: 'Dashboard' },
    { to: '/my-applications',  label: 'Lamaran Saya' },
    { to: '/profile',          label: 'Profil' },
  ],
  umkm: [
    { to: '/',                label: 'Lowongan' },
    { to: '/umkm/dashboard',  label: 'Dashboard' },
    { to: '/umkm/post-job',   label: 'Buat Lowongan' },
    { to: '/umkm/profile',    label: 'Profil' },
  ],
  corporate: [
    { to: '/',                       label: 'Lowongan' },
    { to: '/corporate/dashboard',    label: 'Dashboard' },
    { to: '/corporate/post-job',     label: 'Buat Lowongan' },
    { to: '/corporate/profile',      label: 'Profil' },
  ],
}

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = user ? (NAV_LINKS[user.user_type] || []) : []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-primary-400 font-bold text-lg tracking-tight">
            Rekrutrek
          </Link>

          {/* Nav links — hanya tampil di sm+ */}
          <nav className="hidden sm:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-1.5 rounded-lg text-sm text-neutral-600
                           hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth button */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:block text-xs text-neutral-500 truncate max-w-[120px]">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1.5 rounded-lg border border-neutral-200
                             text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm px-3 py-1.5 text-neutral-600 hover:text-neutral-900">
                  Masuk
                </Link>
                <Link to="/register"
                  className="text-sm px-4 py-1.5 bg-primary-400 text-white rounded-lg
                             hover:bg-primary-600 transition-colors">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Konten halaman ── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      {/* ── Bottom nav (mobile only) ── */}
      {user && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t
                        border-neutral-200 z-40 flex justify-around py-2">
          {links.slice(0, 4).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 px-3 py-1
                         text-xs text-neutral-500 hover:text-primary-400 transition-colors"
            >
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}

      {/* Padding agar konten tidak tertutup bottom nav di mobile */}
      {user && <div className="sm:hidden h-16" />}

    </div>
  )
}
