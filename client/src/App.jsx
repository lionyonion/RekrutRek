import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";

// Dashboards
import JobseekerDashboard from "./dashboards/JobseekerDashboard";
import UmkmDashboard from "./dashboards/UmkmDashboard";
import CorporateDashboard from "./dashboards/CorporateDashboard";

// ==========================================
// APP UTAMA — hanya routing di sini
// ==========================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/:roleId" element={<AuthPage isLogin={true} />} />
        <Route path="/register/:roleId" element={<AuthPage isLogin={false} />} />
        <Route path="/dashboard/jobseeker" element={<JobseekerDashboard />} />
        <Route path="/dashboard/umkm" element={<UmkmDashboard />} />
        <Route path="/dashboard/corporate" element={<CorporateDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}