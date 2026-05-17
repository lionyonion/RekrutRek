import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// Layouts
import MainLayout    from '@/components/layout/MainLayout'
import AuthLayout    from '@/components/layout/AuthLayout'

// Halaman Publik
import LoginPage     from '@/pages/LoginPage'
import RegisterPage  from '@/pages/RegisterPage'
import JobListPage   from '@/pages/JobListPage'
import JobDetailPage from '@/pages/JobDetailPage'

// ── Pencari Kerja ──────────────────────────────────────────
import JobseekerDashboard from '@/pages/jobseeker/Dashboard'
import JobseekerProfile   from '@/pages/jobseeker/Profile'
import MyApplications     from '@/pages/jobseeker/MyApplications'

// ── Pemilik UMKM ───────────────────────────────────────────
import UmkmDashboard      from '@/pages/umkm/Dashboard'
import UmkmProfile        from '@/pages/umkm/Profile'
import PostJob            from '@/pages/umkm/PostJob'
import UmkmApplicants     from '@/pages/umkm/Applicants'

// ── HRD Korporat ───────────────────────────────────────────
import CorporateDashboard from '@/pages/corporate/Dashboard'
import CorporateProfile   from '@/pages/corporate/Profile'
import PostJobCorporate   from '@/pages/corporate/PostJob'
import CorporateApplicants from '@/pages/corporate/Applicants'

// ── Guard: redirect ke login jika belum autentikasi ────────
function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-neutral-500">Memuat...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.user_type))
    return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Halaman publik (tanpa login) ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ── Halaman umum (bisa tanpa login) ── */}
        <Route element={<MainLayout />}>
          <Route index              element={<JobListPage />} />
          <Route path="/jobs/:id"   element={<JobDetailPage />} />
        </Route>

        {/* ── Pencari Kerja ── */}
        <Route element={
          <PrivateRoute roles={['jobseeker']}>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route path="/dashboard"           element={<JobseekerDashboard />} />
          <Route path="/profile"             element={<JobseekerProfile />} />
          <Route path="/my-applications"     element={<MyApplications />} />
        </Route>

        {/* ── Pemilik UMKM ── */}
        <Route element={
          <PrivateRoute roles={['umkm']}>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route path="/umkm/dashboard"       element={<UmkmDashboard />} />
          <Route path="/umkm/profile"         element={<UmkmProfile />} />
          <Route path="/umkm/post-job"        element={<PostJob />} />
          <Route path="/umkm/applicants/:id"  element={<UmkmApplicants />} />
        </Route>

        {/* ── HRD Korporat ── */}
        <Route element={
          <PrivateRoute roles={['corporate']}>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route path="/corporate/dashboard"      element={<CorporateDashboard />} />
          <Route path="/corporate/profile"        element={<CorporateProfile />} />
          <Route path="/corporate/post-job"       element={<PostJobCorporate />} />
          <Route path="/corporate/applicants/:id" element={<CorporateApplicants />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
