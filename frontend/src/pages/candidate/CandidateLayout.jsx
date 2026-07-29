import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./css/dashboard.css";

const CandidateLayout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch("http://localhost:8081/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log(err);
    }

    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <nav className="sidebar">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png"
          className="sidebar-logo"
          alt="logo"
        />

        {/* Dashboard */}
        <div
          className="nav-item"
          onClick={() => navigate("/candidate/dashboard")}
          title="Dashboard"
        >
          <i className="fas fa-home"></i>
        </div>

        {/* Assessments */}
        <div
          className="nav-item"
          onClick={() => navigate("/candidate/assessment/:id")}
          title="Assessments"
        >
          <i className="fas fa-laptop-code"></i>
        </div>

        {/* Results */}
        <div
          className="nav-item"
          onClick={() => navigate("/candidate/results")}
          title="Results"
        >
          <i className="fas fa-chart-line"></i>
        </div>

        {/* Certificates */}
        <div
          className="nav-item"
          onClick={() => navigate("/candidate/certificate")}
          title="Certificates"
        >
          <i className="fas fa-certificate"></i>
        </div>

        {/* Profile */}
        <div
          className="nav-item"
          onClick={() => navigate("/candidate/profile")}
          title="Profile"
        >
          <i className="fas fa-user"></i>
        </div>

        <div className="spacer"></div>

        {/* Logout */}
        <button className="nav-item logout-btn" onClick={logout} title="Logout">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </nav>

      {/* Page Content */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default CandidateLayout;
