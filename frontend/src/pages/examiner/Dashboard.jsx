import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";

import main_logo from "../../assets/main-logo.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({ user: {}, stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:8081/examiner/dashboard", {
        withCredentials: true,
      });

      setData({
        user: res.data.user || {
          name: "Examiner",
          email: "Loading...",
          role: "examiner",
        },
        stats: res.data.stats || {
          students: 0,
          assessments: 0,
          questions: 0,
          certificates: 0,
        },
      });
    } catch (err) {
      // 1. Log the exact error from your friend's backend
      console.error(
        "BACKEND REJECTION REASON:",
        err.response ? err.response.data : err.message,
      );

      // 2. Temporarily turn off the redirect so you stay on the page!
      // navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8081/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.log(err);
    }
    navigate("/login");
  };

  const handleLogout = () => {
    // clear auth data (adjust based on your app)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to login page
    navigate("/login");
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar - Built using your teammate's CSS classes */}
      <nav className="sidebar">
        <img src={main_logo} className="sidebar-logo" alt="Logo" />

        <button
          className="nav-item active"
          onClick={() => navigate("/examiner/dashboard")}
          title="Dashboard"
        >
          <i className="fas fa-home"></i>
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/examiner/create-assessment")}
          title="Create Assessment"
        >
          <i className="fas fa-plus-circle"></i>
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/examiner/assessments")}
          title="My Assessments"
        >
          <i className="fas fa-list-ul"></i>
        </button>

        <div className="spacer"></div>

        <button className="nav-item logout-btn" onClick={logout} title="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header
          style={{
            background: "linear-gradient(135deg, #4f46e5, #9333ea)",
            color: "#fff",
            padding: "25px 30px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          {/* Left Content */}
          <div style={{ maxWidth: "70%" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              Welcome back,{" "}
              <span style={{ color: "#fde68a", fontWeight: "700" }}>
                {data.user.name}
              </span>{" "}
              👋
            </h1>

            <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "4px" }}>
              {data.user.email}
            </p>

            <p
              style={{
                display: "inline-block",
                padding: "6px 12px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "20px",
                fontSize: "13px",
                backdropFilter: "blur(8px)",
              }}
            >
              Role: {data.user.role}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              background: "#fff",
              color: "#4f46e5",
              border: "none",
              padding: "10px 18px",
              borderRadius: "25px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#fde68a";
              e.target.style.color = "#000";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "#fff";
              e.target.style.color = "#4f46e5";
            }}
          >
            Logout
          </button>
        </header>

        {/* Top 4 Stats using Teammate's Grid & Colors */}

        <div className="container">
          <div className="row">
            <div className="col-md-3 pb-2">
              <div className="stat-card blue">
                <h3>Total Students</h3>
                <h2>{data.stats.students}</h2>
                <i className="fas fa-users stat-icon"></i>
              </div>
            </div>

            <div className="col-md-3 pb-2">
              <div className="stat-card green">
                <h3>Assessments</h3>
                <h2>{data.stats.assessments}</h2>
                <i className="fas fa-file-alt stat-icon"></i>
              </div>
            </div>

            <div className="col-md-3 pb-2">
              <div className="stat-card orange">
                <h3>Questions</h3>
                <h2>{data.stats.questions}</h2>
                <i className="fas fa-question-circle stat-icon"></i>
              </div>
            </div>

            <div className="col-md-3 pb-2">
              <div className="stat-card red">
                <h3>Certificates</h3>
                <h2>{data.stats.certificates}</h2>
                <i className="fas fa-certificate stat-icon"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Action Cards */}
        <div className="container mt-3">
          <div className="row">
            {/* Quick Actions */}
            <div className="col-md-6 pb-2">
              <div className="dashboard-card">
                <div className="card-header">
                  <h2>Examiner Actions</h2>
                </div>
                <p>Create new tests and review student submissions.</p>

                <div
                  className="list-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/examiner/create-assessment")}
                >
                  <div className="list-item-left">
                    <i
                      className="fas fa-plus-circle"
                      style={{ color: "#2563eb" }}
                    ></i>
                    <div>
                      <strong>Create Assessment</strong>
                      <p>Draft a new skill test or challenge.</p>
                    </div>
                  </div>
                </div>

                <div
                  className="list-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/examiner/assessments")}
                >
                  <div className="list-item-left">
                    <i
                      className="fas fa-tasks"
                      style={{ color: "#166534" }}
                    ></i>
                    <div>
                      <strong>Manage Assessments</strong>
                      <p>View, edit, and grade active tests.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="col-md-6 pb-2">
              <div className="dashboard-card">
                <h2>Profile Information</h2>
                <p>
                  <b>Name :</b> {data.user.name}
                </p>
                <p>
                  <b>Email :</b> {data.user.email}
                </p>
                <p>
                  <b>Role :</b> {data.user.role}
                </p>
                <p>
                  <b>Department :</b> Examination Board
                </p>
                <p>
                  <b>Status :</b> Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
