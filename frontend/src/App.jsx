import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importing your pages based on the folder structure
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import EmailVerification from './pages/auth/EmailVerification';
import CandidateDashboard from './pages/candidate/Dashboard';
import ExaminerDashboard from './pages/examiner/Dashboard';
import LiveAssessment from './pages/candidate/LiveAssessment';
import CreateAssessment from './pages/examiner/CreateAssessment';
import CertificateView from './pages/candidate/CertificateView';
import ExaminerSubmissions from './pages/examiner/Submissions';
import UserManagement from './pages/examiner/UserManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route element={<EmailVerification path="/verify-email"/>} />
       <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
       <Route path="/examiner/dashboard" element={<ExaminerDashboard />} />
       <Route path="/candidate/assessment" element={<LiveAssessment />} />
       <Route path="/examiner/create-assessment" element={<CreateAssessment />} />
       <Route path="/candidate/certificate" element={<CertificateView />} />
       <Route path="/examiner/submissions" element={<ExaminerSubmissions />} />
       <Route path="/examiner/users" element={<UserManagement />} />
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
