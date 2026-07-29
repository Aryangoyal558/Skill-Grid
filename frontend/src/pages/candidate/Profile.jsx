import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8081/candidate/dashboard", {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      console.log(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="candidate-dashboard-container profile-container p-4">
      {/* Header */}
      <header className="dashboard-header p-4 mb-4 rounded-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="m-0 fw-bold d-flex align-items-center gap-2">
            <span>
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return "Good morning";
                if (hour < 18) return "Good afternoon";
                return "Good evening";
              })()}
              , {user?.name ? user.name.split(" ")[0] : "Candidate"}!
            </span>
            <span className="fs-3">👋</span>
          </h1>
          <p className="user-subtext m-0 mt-1">
            Welcome back to your workspace. Here's a quick view of your account
            & profile settings.
          </p>
        </div>

        {/* Dynamic Quick Status Pill */}
        <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-dark bg-opacity-50 border border-white border-opacity-10 shadow-sm">
          <span
            className="rounded-circle d-inline-block"
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#10b981",
              boxShadow: "0 0 10px #10b981",
            }}
          ></span>
          <span
            className="fs-6 fw-medium text-slate-300"
            style={{ fontSize: "13px", color: "#94a3b8" }}
          >
            Active Session
          </span>
        </div>
      </header>

      <div className="row">
        {/* Profile Card */}
        <div className="col-md-4 pb-3">
          <div className="dashboard-card text-center d-flex flex-column align-items-center justify-content-center">
            <div className="avatar-wrapper mb-3 position-relative">
              <i
                className="fas fa-user-circle"
                style={{
                  fontSize: "90px",
                  color: "#38bdf8",
                  filter: "drop-shadow(0 0 12px rgba(56, 189, 248, 0.5))",
                }}
              ></i>
            </div>

            <h2 className="mt-2 fw-bold text-white fs-4">{user.name}</h2>
            <p className="item-subtext text-capitalize mb-3">{user.role}</p>

            <span
              className={`badge px-3 py-2 rounded-pill ${
                user.isVerified
                  ? "bg-success bg-opacity-20 text-white border border-success"
                  : "bg-warning bg-opacity-20 text-warning border border-warning"
              }`}
            >
              <i
                className={`fas ${user.isVerified ? "fa-check-circle" : "fa-exclamation-circle"} me-1`}
              ></i>
              {user.isVerified ? "Verified Account" : "Pending Verification"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="col-md-8 pb-3">
          <div className="dashboard-card">
            <h2 className="fs-5 fw-semibold mb-3 border-bottom pb-2 border-secondary border-opacity-25">
              Personal Information
            </h2>

            <div className="profile-info-list">
              <p>
                <b>Full Name</b>
                <span>{user.name}</span>
              </p>

              <p>
                <b>Email Address</b>
                <span>{user.email}</span>
              </p>

              <p>
                <b>Phone Number</b>
                <span>{user.phone_no || "Not Added"}</span>
              </p>

              <p>
                <b>Account Role</b>
                <span className="text-capitalize">{user.role}</span>
              </p>

              <p>
                <b>Email Status</b>
                <span
                  className={user.isVerified ? "text-info" : "text-warning"}
                >
                  {user.isVerified ? "Verified" : "Not Verified"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Summary Stats */}
      <div className="row mt-2">
        <div className="col-md-4 pb-3">
          <div className="stat-card blue-stat">
            <h3>Account</h3>
            <h2>Active</h2>
            <i className="fas fa-user-check stat-icon"></i>
          </div>
        </div>

        <div className="col-md-4 pb-3">
          <div className="stat-card green-stat">
            <h3>Email</h3>
            <h2>{user.isVerified ? "Verified" : "Unverified"}</h2>
            <i className="fas fa-envelope stat-icon"></i>
          </div>
        </div>

        <div className="col-md-4 pb-3">
          <div className="stat-card orange-stat">
            <h3>Phone</h3>
            <h2>{user.phone_no ? "Added" : "Pending"}</h2>
            <i className="fas fa-phone stat-icon"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
