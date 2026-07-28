import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./css/Login.css";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_LOGIN_URL,

        formData,

        {
          withCredentials: true,
        },
      );

      alert(response.data.message);

      const user = response.data.user;

      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="app-container">
        <header className="platform-header">
          <div className="logo-container">
            <img src={logo} className="platform-logo" alt="" />

            <div className="logo-text">
              <span className="platform-title">
                Online Skill Assessment and Digital Certification Platform
              </span>
            </div>
          </div>
        </header>

        <div className="main-container">
          <div className="content-box">
            <h2>Welcome to Ujwal Radiant Vision</h2>

            <p className="subtitle">Choose your role</p>

            <div className="role-cards">
              <div
                className={`role-card ${role === "candidate" ? "selected" : ""}`}
                onClick={() => handleRole("candidate")}
              >
                <img src={stud} alt="" className="role-icon" />

                <h3>Candidate</h3>
              </div>

              <div
                className={`role-card ${role === "examiner" ? "selected" : ""}`}
                onClick={() => handleRole("examiner")}
              >
                <img src={examine} alt="" className="role-icon" />

                <h3>Examiner</h3>
              </div>

              <div
                className={`role-card ${role === "admin" ? "selected" : ""}`}
                onClick={() => handleRole("admin")}
              >
                <img src={admi} alt="" className="role-icon" />

                <h3>Administrator</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>

              <button type="submit">Login</button>
            </form>

            <Link to="/forgot-password">Forgot Password?</Link>
            <div className="register-link">
              Don't have an account? <Link to="/register">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
