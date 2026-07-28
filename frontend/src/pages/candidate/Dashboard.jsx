import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../context/AuthContext";

import "./css/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, loading, setUser } = useContext(AuthContext);

  const [assessments, setAssessments] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const res = await axios.get("http://localhost:8081/assessment", {
        withCredentials: true,
      });

      setAssessments(res.data.assessments);
    } catch (err) {
      console.log(err);
    } finally {
      setPageLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8081/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );

      setUser(null);

      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading || pageLoading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        Loading...
      </h2>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <nav className="sidebar">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png"
          alt="logo"
          className="sidebar-logo"
        />

        <div className="nav-item active">Dashboard</div>

        <div className="spacer"></div>

        <button className="nav-item" onClick={logout}>
          Logout
        </button>
      </nav>

      {/* Main */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Welcome, {user.name}</h1>

          <p>{user.email}</p>

          <p>
            Role :<strong> {user.role}</strong>
          </p>
        </header>

        {/* Profile */}
        <div className="card">
          <h2>Profile Information</h2>

          <p>
            <b>Name :</b> {user.name}
          </p>

          <p>
            <b>Email :</b> {user.email}
          </p>

          <p>
            <b>Role :</b> {user.role}
          </p>

          <p>
            <b>Phone :</b> {user.phone_no || "Not Added"}
          </p>

          <p>
            <b>Verified :</b> {user.isVerified ? "Yes" : "No"}
          </p>

          <p>
            <b>Status :</b> {user.isActive ? "Active" : "Inactive"}
          </p>

          <p>
            <b>Joined :</b> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Assessments */}

        <div className="card" style={{ marginTop: "25px" }}>
          <h2>Available Assessments</h2>

          {assessments.length === 0 ? (
            <h3>No Assessments Available</h3>
          ) : (
            assessments.map((assessment) => (
              <div key={assessment._id} className="assessment-card">
                <h3>{assessment.title}</h3>

                <p>{assessment.description}</p>

                <p>
                  <strong>Duration:</strong> {assessment.duration} Minutes
                </p>

                <p>
                  <strong>Total Marks:</strong> {assessment.totalMarks}
                </p>

                <button
                  className="btn-primary"
                  onClick={() => navigate(`/candidate/exam/${assessment._id}`)}
                >
                  Start Assessment
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
