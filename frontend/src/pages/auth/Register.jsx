import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./css/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("candidate");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: "candidate",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    setFormData((prev) => ({
      ...prev,
      roles: selectedRole,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return alert("All fields are required.");
    }

    if (formData.password.length < 6) {
      return alert("Password must contain at least 6 characters.");
    }

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        import.meta.env.VITE_SERVER_SIGNUP_URL,
        formData,
        {
          withCredentials: true,
        },
      );

      alert(response.data.message);

      setFormData({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        roles: "candidate",
      });

      setRole("candidate");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = () => {
    switch (role) {
      case "candidate":
        return "Candidate";
      case "examiner":
        return "Examiner";
      case "admin":
        return "Administrator";
      default:
        return "Candidate";
    }
  };

  return (
    <div className="register-page">
      <header className="platform-header">
        <div className="logo-container">
          <div className="logo-text">
            <span className="company-name">UJWAL RADIANT VISION</span>

            <span className="platform-title">
              Online Skill Assessment and Digital Certification Platform
            </span>
          </div>
        </div>
      </header>

      <div className="main-container">
        <div className="content-box">
          <h2>Welcome to Ujwal Radiant Vision</h2>

          <p className="subtitle">
            Choose your role to access your personalized dashboard.
          </p>

          <div className="role-cards">
            {/* Candidate */}

            <div
              className={`role-card ${role === "candidate" ? "selected" : ""}`}
              onClick={() => handleRoleChange("candidate")}
            >
              <h3>CANDIDATE (Student)</h3>

              <p>Access assessments, track progress and certificates.</p>
            </div>

            {/* Examiner */}

            <div
              className={`role-card ${role === "examiner" ? "selected" : ""}`}
              onClick={() => handleRoleChange("examiner")}
            >
              <h3>EXAMINER</h3>

              <p>Create assessments and evaluate students.</p>
            </div>

            {/* Admin */}

            <div
              className={`role-card ${role === "admin" ? "selected" : ""}`}
              onClick={() => handleRoleChange("admin")}
            >
              <h3>ADMINISTRATOR</h3>

              <p>Manage users and platform settings.</p>
            </div>
          </div>

          <div className="form-box">
            <div className="form-title">
              Sign Up as <span>{getRoleDisplayName()}</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
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

              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="terms-text">
                By signing up you agree to our Terms & Conditions.
              </p>

              <button
                type="submit"
                className="action-btn signup-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "SIGN UP"}
              </button>

              <div className="register-link">
                Already have an account?
                <Link to="/login"> Login here.</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
