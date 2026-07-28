import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Importing your pages based on the folder structure
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import EmailVerification from "./pages/auth/EmailVerification";
import CandidateDashboard from "./pages/candidate/Dashboard";
import ExaminerDashboard from "./pages/examiner/Dashboard";
import LiveAssessment from "./pages/candidate/LiveAssessment";
import CreateAssessment from "./pages/examiner/CreateAssessment";
import CertificateView from "./pages/candidate/CertificateView";
import CertificateVerification from './pages/CertificateVerification';
import ExaminerSubmissions from "./pages/examiner/Submissions";
import UserManagement from "./pages/examiner/UserManagement";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Certificate Verification Routes */}
        <Route path="/verify" element={<CertificateVerification />} />
        <Route path="/verify/:certificateNumber" element={<CertificateVerification />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        
        
        
        <Route path="/verify-email" element={<EmailVerification />} />
        
        {/* Candidate Routes */}
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/assessment" element={<LiveAssessment />} />
        <Route path="/candidate/certificate" element={<CertificateView />} />
        
        {/* Examiner Routes */}
        <Route path="/examiner/dashboard" element={<ExaminerDashboard />} />
        <Route path="/examiner/create-assessment" element={<CreateAssessment />} />
        <Route path="/examiner/submissions" element={<ExaminerSubmissions />} />
        <Route path="/examiner/users" element={<UserManagement />} />
        
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
