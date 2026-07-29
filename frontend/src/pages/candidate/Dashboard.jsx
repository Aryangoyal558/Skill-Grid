import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./css/Dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidateDashboardData();
  }, []);

  const fetchCandidateDashboardData = async () => {
    try {
      // Fetch user profile first
      const userRes = await axios.get(
        "http://localhost:8081/candidate/dashboard",
        {
          withCredentials: true,
        }
      );
      setUser(userRes.data.user);

      // Fetch optional dashboard lists safely
      const [assessmentsRes, certsRes] = await Promise.allSettled([
        axios.get("http://localhost:8081/candidate/assessments", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8081/certificate/my", {
          withCredentials: true,
        }),
      ]);

      if (assessmentsRes.status === "fulfilled") {
        setAssessments(assessmentsRes.value.data.assessments || []);
      }
      if (certsRes.status === "fulfilled") {
        setCertificates(certsRes.value.data.certificates || []);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="candidate-dashboard-container">
      {/* Header */}
      <header className="dashboard-header flex justify-between items-center p-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name} 👋</h1>
          <p className="text-sm user-subtext">
            {user.email} | Role: <span className="capitalize">{user.role}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="logout-btn px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Logout
        </button>
      </header>

      {/* KPI Stats Section */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3 pb-2">
            <div className="stat-card blue-stat">
              <h3>Account Status</h3>
              <h2>{user.isVerified ? "Verified" : "Pending"}</h2>
              <i className="fas fa-user-check stat-icon"></i>
            </div>
          </div>

          <div className="col-md-3 pb-2">
            <div className="stat-card green-stat">
              <h3>Available Tests</h3>
              <h2>{assessments.length}</h2>
              <i className="fas fa-file-alt stat-icon"></i>
            </div>
          </div>

          <div className="col-md-3 pb-2">
            <div className="stat-card purple-stat">
              <h3>Certificates</h3>
              <h2>{certificates.length}</h2>
              <i className="fas fa-award stat-icon"></i>
            </div>
          </div>

          <div className="col-md-3 pb-2">
            <div className="stat-card orange-stat">
              <h3>Role</h3>
              <h2 className="capitalize">{user.role}</h2>
              <i className="fas fa-user-tag stat-icon"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mt-4">
        <div className="row">
          {/* Profile Card */}
          <div className="col-md-5 pb-2">
            <div className="dashboard-card">
              <div className="card-header mb-3">
                <h2 className="text-xl font-bold">Profile Information</h2>
              </div>
              <div className="profile-info-list">
                <p>
                  <b>Name:</b> <span>{user.name}</span>
                </p>
                <p>
                  <b>Email:</b> <span>{user.email}</span>
                </p>
                <p>
                  <b>Phone:</b> <span>{user.phone_no || "Not Added"}</span>
                </p>
                <p>
                  <b>Verified:</b> <span>{user.isVerified ? "Yes" : "No"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Available Skill Assessments Section */}
          <div className="col-md-7 pb-2">
            <div className="dashboard-card">
              <h2 className="text-xl font-bold mb-2">
                Available Skill Assessments
              </h2>
              <p className="card-subtitle mb-4">
                Select an assessment to start your evaluation.
              </p>

              {assessments.length === 0 ? (
                <p className="empty-text">
                  No published assessments available right now.
                </p>
              ) : (
                <div className="space-y-3">
                  {assessments.map((test) => (
                    <div key={test._id} className="list-item">
                      <div className="list-item-left flex items-center gap-3">
                        <i className="fas fa-code icon-badge"></i>
                        <div>
                          <strong className="block item-title">
                            {test.title}
                          </strong>
                          <p className="item-subtext">
                            Duration: {test.timeLimit} mins | Passing Score:{" "}
                            {test.minPassScore}%
                          </p>
                        </div>
                      </div>
                      {test.attempted ? (
                        <button disabled className="btn-completed">
                          Completed ✓
                        </button>
                      ) : (
                        <Link
                          to={`/candidate/assessment/${test._id}`}
                          className="btn-start"
                        >
                          Start Test
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Section */}
      <div className="container mt-4 mb-6">
        <div className="row">
          <div className="col-md-12">
            <div className="dashboard-card">
              <h2 className="text-xl font-bold mb-3">Earned Certificates</h2>
              {certificates.length === 0 ? (
                <p className="empty-text">
                  No certificates earned yet. Complete and pass an assessment to
                  issue your digital certificate.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div key={cert._id} className="cert-card">
                      <div>
                        <strong className="item-title">
                          {cert.assessmentTitle}
                        </strong>
                        <p className="item-subtext">
                          Issued:{" "}
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        to={`/candidate/verify-certificate/${cert.certificateCode}`}
                        className="btn-verify"
                      >
                        View & Verify
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;