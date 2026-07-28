import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");

      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters");

      return;
    }

    try {
      setLoading(true);

      const resetPasswordUrl = import.meta.env.VITE_SERVER_RESET_PASSWORD_URL || "http://localhost:5000/auth/reset-password";

      const res = await axios.post(
        resetPasswordUrl,
        {
          email,
          otp,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
      );

      alert(res.data.message);

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="app-container">
        <header className="platform-header">
          <div className="logo-container">
            <img src={logo} alt="logo" className="platform-logo" />

            <div className="logo-text">
              <span className="company-name">UJWAL RADIANT VISION</span>

              <span className="platform-title">
                Online Skill Assessment and Digital Certification Platform
              </span>
            </div>
          </div>
        </header>

        <div className="main-container">
          <div className="form-box">
            <h2>Reset Password</h2>

            <p className="subtitle">Enter your new password.</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="New Password"
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

              <button className="action-btn" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>

            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
