import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./css/ForgotPassword.css";
import logo from "../../assets/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_SERVER_VERIFY_EMAIL_URL, { email });
      console.log("Requesting password reset for:", email);
      alert("Email Verified");
      navigate("/change-password", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }

    // Show success message to the user
  };

  return (
    <div className="forgot-password-page">
      <div className="app-container">
        {/* Header */}
        <header className="platform-header">
          <div className="logo-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png"
              alt="Ujwal Radiant Vision"
              className="platform-logo"
            />
            <div className="logo-text">
              <span className="company-name">UJWAL RADIANT VISION</span>
              <span className="platform-title">
                Online Skill Assessment and Digital Certification Platform
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="main-container">
          <div className="form-box">
            <h2>Forgot Password?</h2>
            <p className="subtitle">
              Enter the email address associated with your account and we'll
              send you a link to reset your password.
            </p>

            {isSubmitted ? (
              <div className="success-message">
                <strong>Check your inbox!</strong>
                <br />
                If an account exists for {email}, a reset link has been sent.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="action-btn">
                  Send Reset Link
                </button>
              </form>
            )}

            <Link to="/login" className="back-link">
              &larr; Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
