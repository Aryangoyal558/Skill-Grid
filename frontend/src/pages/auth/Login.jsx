import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Login.css";

// Your friend's local image imports
import logo from "../../assets/logo.png";
import stud from "../../assets/stud.png";
import examine from "../../assets/examine.png";
import admi from "../../assets/admi.png";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "candidate",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRole = (selectedRole) => {
    setRole(selectedRole);
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  // Your friend's exact backend submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginUrl = import.meta.env.VITE_SERVER_LOGIN_URL || "http://localhost:5000/auth/login";

      const response = await axios.post(
        loginUrl,
        formData,
        {
          withCredentials: true, // This tells the browser to accept secure cookies from the backend
        }
      );

      // Keep the alerts for now as your friend set them up
      alert(response.data.message);
      const user = response.data.user;
      navigate(`/${user.role}/dashboard`);
      
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // Helper to capitalize the role for the UI
  const getRoleDisplayName = () => {
    if (role === 'candidate') return 'Candidate';
    if (role === 'examiner') return 'Examiner';
    return 'Administrator';
  };

  return (
    <div className="login-page">
      <div className="app-container">
        
        {/* Restored Beautiful Header */}
        <header className="platform-header">
          <div className="logo-container">
            <img src={logo} alt="Ujwal Radiant Vision" className="platform-logo" />
            <div className="logo-text">
              <span className="company-name">UJWAL RADIANT VISION</span>
              <span className="platform-title">Online Skill Assessment and Digital Certification Platform</span>
            </div>
          </div>
        </header>

        <div className="main-container">
          <div className="content-box">
            <h2>Welcome to Ujwal Radiant Vision</h2>
            <p className="subtitle">Choose your role to access your personalized dashboard.</p>

            {/* Restored Role Cards with friend's imported images */}
            <div className="role-cards">
              <div
                className={`role-card card-candidate ${role === "candidate" ? "selected" : ""}`}
                onClick={() => handleRole("candidate")}
              >
                <img src={stud} alt="Candidate" className="role-icon" />
                <h3>CANDIDATE (Student)</h3>
                <p>Access assessments, track progress, and view certificates.</p>
              </div>

              <div
                className={`role-card card-examiner ${role === "examiner" ? "selected" : ""}`}
                onClick={() => handleRole("examiner")}
              >
                <img src={examine} alt="Examiner" className="role-icon" />
                <h3>EXAMINER</h3>
                <p>Create and manage assessments, grade submissions.</p>
              </div>

              <div
                className={`role-card card-admin ${role === "admin" ? "selected" : ""}`}
                onClick={() => handleRole("admin")}
              >
                <img src={admi} alt="Administrator" className="role-icon" />
                <h3>ADMINISTRATOR</h3>
                <p>Manage platform settings, users, and overall operations.</p>
              </div>
            </div>

            {/* Restored Form Structure */}
            <div className="form-box">
              <div className="form-title">
                  Login as <span>{getRoleDisplayName()}</span>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="forgot-password" style={{ textAlign: 'right', marginBottom: '20px' }}>
                  <Link to="/forgot-password" style={{ color: '#2563eb', fontSize: '0.9em', textDecoration: 'none' }}>
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="action-btn login-btn">
                  SIGN IN
                </button>
              </form>

              <div className="register-link" style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
                Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold' }}>Register here</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;