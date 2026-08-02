import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./css/Register.css";

const VerifyRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  if (!email) {
    return (
      <div className="register-page">
        <div className="main-container">
          <div className="content-box">
            <h2>Email Not Found</h2>

            <p className="subtitle">
              We couldn't find your email address.
              <br />
              Please register again or login.
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                marginTop: "25px",
              }}
            >
              <Link to="/register" className="action-btn signup-btn">
                Register
              </Link>

              <Link to="/login" className="action-btn signup-btn">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return alert("Please enter OTP.");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8081/auth/verify-registration",
        {
          email,
          otp,
        },
        {
          withCredentials: true,
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

  const resendOTP = async () => {
    try {
      setResending(true);

      const res = await axios.post(
        "http://localhost:8081/auth/resend-verification",
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      alert(res.data.message || "OTP Sent Successfully");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="register-page">
      <div className="main-container">
        <div className="content-box">
          <h2>Email Verification</h2>

          <p className="subtitle">We've sent a 6-digit verification code to</p>

          <h3
            style={{
              color: "#2563eb",
              marginBottom: "25px",
            }}
          >
            {email}
          </h3>

          <form onSubmit={handleVerify}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter 6 Digit OTP"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="action-btn signup-btn"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            Didn't receive the OTP?
            <button
              type="button"
              onClick={resendOTP}
              disabled={resending}
              style={{
                border: "none",
                background: "none",
                color: "#2563eb",
                cursor: "pointer",
                marginLeft: "8px",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
            }}
          >
            <Link
              to="/login"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyRegistration;