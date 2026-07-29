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

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Common Layout & Landing Component Imports
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage"; 

// Auth Pages (inside src/pages/auth/)
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyRegistration from "./pages/auth/VerifyRegistration";

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
import SelectSkill from "./pages/examiner/SelectSkill";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";

import VerifyCertificate from "./pages/VerifyCertificate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC / AUTH (SHARED HEADER LAYOUT) ================= */}
        <Route element={<Layout />}>
          {/* Landing Page as root */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-registration" element={<VerifyRegistration />} />
        </Route>

        {/* ================= CANDIDATE ================= */}
        <Route
          path="/candidate"
          element={
            <ProtectedRoute roles={["candidate"]}>
              <CandidateLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="assessment" element={<LiveAssessment />} />
          <Route path="assessment/:assessmentId" element={<TaskAssessment />} />
          <Route path="results" element={<MyResult />} />
          <Route path="certificate" element={<CertificateView />} />
          <Route
            path="verify-certificate/:certificateCode"
            element={<VerifyCertificate />}
          />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ================= EXAMINER ================= */}
        <Route
          path="/examiner/manage-questions/:assessmentId"
          element={<ManageQuestions />}
        />
        <Route
          path="/examiner/dashboard"
          element={
            <ProtectedRoute roles={["examiner"]}>
              <ExaminerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/examiner/create-assessment" element={<SelectSkill />} />
        <Route
          path="/examiner/create-assessment-form"
          element={<CreateAssessment />}
        />
        <Route path="/examiner/assessments" element={<AssessmentList />} />
        <Route
          path="/examiner/questions/:assessmentId"
          element={<ManageQuestions />}
        />
        <Route path="/examiner/question/edit/:id" element={<EditQuestion />} />
        <Route path="/examiner/results/:id" element={<ViewResults />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;