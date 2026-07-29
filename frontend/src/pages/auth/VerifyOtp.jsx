import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        import.meta.env.VITE_SERVER_VERIFY_OTP_URL,
        {
          email,
          otp,
        },
      );

      alert(res.data.message);

      navigate("/reset-password", {
        state: { email, otp },
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="main-container">
        <div className="form-box">
          <h2>Verify OTP</h2>

          <p className="subtitle">
            Enter the OTP sent to
            <br />
            <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>

            <button className="action-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <Link to="/forgot-password" className="back-link">
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;