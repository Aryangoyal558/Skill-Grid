import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const userInfo = location.state?.user_info;
  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png"
          alt="Logo"
          className="sidebar-logo"
        />

        <div className="nav-item active" title="Home">
          <i className="fas fa-home"></i>{" "}
          {/* Requires FontAwesome in index.html */}
        </div>
        <div className="nav-item" title="Community">
          <i className="fas fa-user-friends"></i>
        </div>
        <div className="nav-item" title="Assessments">
          <i className="fas fa-file-alt"></i>
        </div>
        <div className="nav-item" title="Learning">
          <i className="fas fa-play-circle"></i>
        </div>
        <div className="nav-item" title="Settings">
          <i className="fas fa-cog"></i>
        </div>

        <div className="spacer"></div>

        <Link to="/login" className="nav-item" title="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </Link>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, {userInfo?.name}</h1>
          <p>Your Skill Path</p>
        </header>

        <div className="dashboard-grid">
          {/* Left Column (Wider) */}
          <div className="grid-left">
            {/* Active Exams Card */}
            <div className="card">
              <h2>My Active Exams</h2>
              <div className="exam-list">
                <div className="exam-item">
                  <div className="exam-header">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/5968/5968350.png"
                      alt="Python"
                    />
                    <h3>Python Basics</h3>
                  </div>
                  <p>
                    <span className="status-badge status-in-progress">
                      Status: In-Progress
                    </span>{" "}
                    45:12
                  </p>
                  <button className="btn-primary">Continue Test</button>
                </div>
                <div className="exam-item">
                  <div className="exam-header">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1126/1126012.png"
                      alt="React"
                    />
                    <h3>React.js Advanced</h3>
                  </div>
                  <p>
                    <span className="status-badge status-scheduled">
                      Status: Scheduled
                    </span>
                  </p>
                  <button className="btn-secondary">Prepare</button>
                </div>
              </div>
            </div>

            {/* Results Table Card */}
            <div className="card">
              <h2>My Results</h2>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Assessment Title</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>12/08/2024</td>
                    <td>Data Science</td>
                    <td>85%</td>
                    <td>
                      <span className="pass-badge">Pass</span>
                    </td>
                    <td>
                      <i
                        className="fas fa-download"
                        style={{ color: "#2563eb", cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>13/08/2024</td>
                    <td>HTML/CSS</td>
                    <td>92%</td>
                    <td>
                      <span className="pass-badge">Pass</span>
                    </td>
                    <td>
                      <i
                        className="fas fa-download"
                        style={{ color: "#2563eb", cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>22/08/2024</td>
                    <td>React.js Advanced</td>
                    <td>85%</td>
                    <td>
                      <span className="pass-badge">Pass</span>
                    </td>
                    <td>
                      <i
                        className="fas fa-download"
                        style={{ color: "#2563eb", cursor: "pointer" }}
                      ></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column (Narrower) */}
          <div className="grid-right">
            {/* Achievements Card */}
            <div className="card">
              <h2>Achievements & Certificates</h2>
              <div
                className="certificate-badge"
                style={{ backgroundColor: "#fef9c3", borderColor: "#fde047" }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5968/5968350.png"
                  alt="Python"
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: "1em" }}>
                    Python Certified
                  </h3>
                </div>
              </div>
              <div
                className="certificate-badge"
                style={{ backgroundColor: "#e0f2fe", borderColor: "#bae6fd" }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1126/1126012.png"
                  alt="React"
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: "1em" }}>Front-End Dev</h3>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn-secondary" style={{ flex: 1 }}>
                  <i className="fas fa-file-pdf"></i> Download PDF
                </button>
                <button className="btn-secondary" style={{ flex: 1 }}>
                  <i className="fab fa-linkedin"></i> Share
                </button>
              </div>
            </div>

            {/* Verify Certificate Card */}
            <div
              className="card"
              style={{ backgroundColor: "#0f766e", color: "white" }}
            >
              <h2 style={{ color: "white", textAlign: "center" }}>
                Verify a Certificate
              </h2>
              <div className="verify-input">
                <input type="text" placeholder="Enter your ID" />
                <button>
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="card">
              <h2>Notifications</h2>
              <div className="notification-item">
                <i
                  className="fas fa-bell"
                  style={{ color: "#d97706", fontSize: "1.5em" }}
                ></i>
                <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>
                  <strong>New assessment available</strong>
                  <br />
                  Java Object Oriented Programming
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
