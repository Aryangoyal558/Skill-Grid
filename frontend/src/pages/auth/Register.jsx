import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Register.css";
import stud from "../../assets/stud.png";
import examine from "../../assets/examine.png";
import admi from "../../assets/admi.png";
import about_1 from "../../assets/about_1.png";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
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
        { withCredentials: true },
      );

      alert(response.data.message);

      setFormData({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        roles: "candidate",
      });

      setRole("candidate");

      navigate("/verify-registration", {
        state: { email: formData.email },
      });
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
    <div>
      <div className="container text-center d-flex justify-content-center align-items-center">
        <div className="row">
          <div className="col-md-12">
            <h2>Welcome to Ujwal Radiant Vision</h2>
            <p className="subtitle">
              Choose your role to access your personalized dashboard.
            </p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="form-box">
              <div className="form-title">Sign Up</div>

              <form onSubmit={handleSubmit}>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group mb-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group mb-2">
                  <input
                    type="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group mb-2">
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
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="input-group mb-2">
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div style={{ textAlign: "center", marginTop: "15px" }}>
                  <p style={{ fontSize: "12px", marginBottom: "10px" }}>
                    By signing up you agree to our Terms & Conditions.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="signup-button"
                  >
                    {loading ? "Creating Account..." : "SIGN UP"}
                  </button>

                  <div style={{ marginTop: "10px" }}>
                    Already have an account? <Link to="/login">Login</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
