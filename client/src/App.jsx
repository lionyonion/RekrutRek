import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute"; 

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";

// Dashboards
import JobseekerDashboard from "./dashboards/JobseekerDashboard";
import UmkmDashboard from "./dashboards/UmkmDashboard";
import CorporateDashboard from "./dashboards/CorporateDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:roleId" element={<AuthPage isLogin={true} />} />
          <Route path="/register/:roleId" element={<AuthPage isLogin={false} />} />

          <Route
            path="/dashboard/jobseeker"
            element={
              <ProtectedRoute allowedRole="jobseeker">
                <JobseekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/umkm"
            element={
              <ProtectedRoute allowedRole="umkm">
                <UmkmDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/corporate"
            element={
              <ProtectedRoute allowedRole="corporate">
                <CorporateDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}