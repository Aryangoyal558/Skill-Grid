import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./css/dashboard.css";
import main_logo from "../../assets/main-logo.png";

const CandidateLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const isActive = (path) => location.pathname === path;

  return (
    <div className="custom-dashboard-layout">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="custom-sidebar-overlay" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Main Responsive Sidebar */}
      <aside className={`custom-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="custom-sidebar-top">
          <img src={main_logo} className="custom-sidebar-logo" alt="logo" />
        </div>

        <nav className="custom-sidebar-menu">
          {/* Dashboard */}
          <div
            className={`custom-nav-link ${isActive("/candidate/dashboard") ? "active" : ""}`}
            onClick={() => {
              navigate("/candidate/dashboard");
              setMobileOpen(false);
            }}
            title="Dashboard"
          >
            <i className="fas fa-home"></i>
            <span>DASHBOARD</span>
          </div>

          {/* Assessments */}
          <div
            className={`custom-nav-link ${isActive("/candidate/assessment") ? "active" : ""}`}
            onClick={() => {
              navigate("/candidate/assessment");
              setMobileOpen(false);
            }}
            title="Assessments"
          >
            <i className="fas fa-laptop-code"></i>
            <span>ASSESSMENTS</span>
          </div>

          {/* Results */}
          <div
            className={`custom-nav-link ${isActive("/candidate/results") ? "active" : ""}`}
            onClick={() => {
              navigate("/candidate/results");
              setMobileOpen(false);
            }}
            title="Results"
          >
            <i className="fas fa-chart-line"></i>
            <span>RESULTS</span>
          </div>

          {/* Certificates */}
          <div
            className={`custom-nav-link ${isActive("/candidate/certificate") ? "active" : ""}`}
            onClick={() => {
              navigate("/candidate/certificate");
              setMobileOpen(false);
            }}
            title="Certificates"
          >
            <i className="fas fa-certificate"></i>
            <span>CERTIFICATES</span>
          </div>

          {/* Profile */}
          <div
            className={`custom-nav-link ${isActive("/candidate/profile") ? "active" : ""}`}
            onClick={() => {
              navigate("/candidate/profile");
              setMobileOpen(false);
            }}
            title="Profile"
          >
            <i className="fas fa-user"></i>
            <span>PROFILE</span>
          </div>
        </nav>

        <div className="custom-spacer"></div>

        {/* Logout Button */}
        <button className="custom-logout-btn" onClick={logout} title="Logout">
          <i className="fas fa-sign-out-alt"></i>
          <span>LOGOUT</span>
        </button>
      </aside>

      {/* Main Page Area */}
      <main className="custom-dashboard-main">
        {/* Mobile Header Bar Toggle */}
        <div className="mobile-header-bar">
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <span className="mobile-app-title">PORTAL</span>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default CandidateLayout;