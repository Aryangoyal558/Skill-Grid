// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";

// // Importing your pages based on the folder structure
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import EmailVerification from "./pages/auth/EmailVerification";
// import CandidateDashboard from "./pages/candidate/Dashboard";
// import ExaminerDashboard from "./pages/examiner/Dashboard";
// import ManageQuestions from "./pages/examiner/ManageQuestions";
// import LiveAssessment from "./pages/candidate/LiveAssessment";
// import CreateAssessment from "./pages/examiner/CreateAssessment";
// import AdminDashboard from "./pages/admin/Dashboard";
// import CertificateView from "./pages/candidate/CertificateView";
// import ExaminerSubmissions from "./pages/examiner/Submissions";
// import UserManagement from "./pages/examiner/UserManagement";
// import TaskAssessment from "./pages/candidate/TaskAssessment";
// import VerifyOtp from "./pages/auth/VerifyOtp";
// import MyResult from "./pages/candidate/MyResult";
// import AssessmentList from "./pages/examiner/AssessmentList";
// import EditQuestion from "./pages/examiner/EditQuestion";
// import ViewResults from "./pages/examiner/ViewResult";
// import ResetPassword from "./pages/auth/ResetPassword";
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Default route redirects to Login */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* Auth Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/verify-otp" element={<VerifyOtp />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route
//           path="/candidate/dashboard"
//           element={
//             <ProtectedRoute roles={["candidate"]}>
//               <CandidateDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/examiner/dashboard"
//           element={
//             <ProtectedRoute roles={["examiner"]}>
//               <ExaminerDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/candidate/exam/:assessmentId"
//           element={
//             <ProtectedRoute roles={["candidate"]}>
//               <TaskAssessment />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute roles={["admin"]}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/examiner/assessments" element={<AssessmentList />} />

//         <Route path="/examiner/question/edit/:id" element={<EditQuestion />} />

//         <Route path="/examiner/results/:id" element={<ViewResults />} />
//         <Route
//           path="/examiner/create-assessment"
//           element={<CreateAssessment />}
//         />
//         <Route
//           path="/candidate/results"
//           element={
//             <ProtectedRoute roles={["candidate"]}>
//               <MyResult />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/examiner/questions/:assessmentId"
//           element={<ManageQuestions />}
//         />
//         <Route path="/candidate/certificate" element={<CertificateView />} />
//         <Route path="/examiner/submissions" element={<ExaminerSubmissions />} />
//         <Route path="/examiner/users" element={<UserManagement />} />
//         {/* Fallback for unknown routes */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
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

// Candidate Pages
import CandidateLayout from "./pages/candidate/CandidateLayout";
import CandidateDashboard from "./pages/candidate/Dashboard";
import CertificateView from "./pages/candidate/CertificateView";
import MyResult from "./pages/candidate/MyResult";
import TaskAssessment from "./pages/candidate/TaskAssessment";
import Profile from "./pages/candidate/Profile";
import LiveAssessment from "./pages/candidate/LiveAssessment";

// Examiner Pages
import ExaminerDashboard from "./pages/examiner/Dashboard";
import CreateAssessment from "./pages/examiner/CreateAssessment";
import ExaminerSubmissions from "./pages/examiner/Submissions";
import UserManagement from "./pages/examiner/UserManagement";
import ManageQuestions from "./pages/examiner/ManageQuestions";
import AssessmentList from "./pages/examiner/AssessmentList";
import EditQuestion from "./pages/examiner/EditQuestion";
import ViewResults from "./pages/examiner/ViewResult";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT */}

        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Certificate Verification Routes */}
        <Route path="/verify" element={<CertificateVerification />} />
        <Route path="/verify/:certificateNumber" element={<CertificateVerification />} />

        {/* AUTH ROUTES */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= CANDIDATE ================= */}

        <Route
          path="/candidate"
          element={
            <ProtectedRoute roles={["candidate"]}>
              <CandidateLayout />
            </ProtectedRoute>
          }
        >
          {/* /candidate */}

          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard */}

          <Route path="dashboard" element={<CandidateDashboard />} />

          {/* Start Assessment */}
          <Route path="assessment" element={<LiveAssessment />} />

          <Route path="assessment/:assessmentId" element={<TaskAssessment />} />

          {/* Results */}

          <Route path="results" element={<MyResult />} />

          {/* Certificate */}

          <Route path="certificate" element={<CertificateView />} />

          {/* Profile */}

          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ================= EXAMINER ================= */}

        <Route
          path="/examiner/dashboard"
          element={
            <ProtectedRoute roles={["examiner"]}>
              <ExaminerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/examiner/create-assessment"
          element={<CreateAssessment />}
        />

        <Route path="/examiner/assessments" element={<AssessmentList />} />

        <Route
          path="/examiner/questions/:assessmentId"
          element={<ManageQuestions />}
        />

        <Route path="/examiner/question/edit/:id" element={<EditQuestion />} />

        <Route path="/examiner/results/:id" element={<ViewResults />} />

        
        
        
        
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

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}

        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
