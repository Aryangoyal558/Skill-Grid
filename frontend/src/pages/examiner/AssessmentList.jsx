import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";
import "./css/AssessmentList.css";

const AssessmentList = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssessments();
  }, []);

  const getAssessments = async () => {
    try {
      const res = await axios.get("http://localhost:8081/examiner/my", {
        withCredentials: true,
      });
      setAssessments(res.data.assessments);
    } catch (err) {
      console.error("Failed to fetch assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  const publishAssessment = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:8081/examiner/assessment/${id}/publish`,
        {},
        {
          withCredentials: true,
        },
      );

      alert(res.data.message);
      getAssessments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish assessment");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* 1. Global Sidebar */}
      <nav className="sidebar">
        <div
          className="sidebar-logo"
          style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}
        >
          URV
        </div>
        <button
          className="nav-item"
          onClick={() => navigate("/examiner/dashboard")}
          title="Dashboard"
        >
          <i className="fas fa-home"></i>
        </button>
        <button
          className="nav-item"
          onClick={() => navigate("/examiner/create-assessment")}
          title="Create Assessment"
        >
          <i className="fas fa-plus-circle"></i>
        </button>
        <button
          className="nav-item active"
          onClick={() => navigate("/examiner/assessments")}
          title="My Assessments"
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <div className="spacer"></div>
      </nav>

      {/* 2. Main Content Area */}
      <main className="dashboard-main">
        <div
          className="header-actions d-flex justify-content-between align-items-center flex-wrap"
          style={{
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            color: "#e2e8f0",
            padding: "20px 25px",
            borderRadius: "16px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
            marginBottom: "20px",
            gap: "15px",
          }}
        >
          {/* Left Content */}
          <div className="col-12 col-md-8 p-0">
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#f1f5f9",
              }}
            >
              My Assessments
            </h1>

            <p
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                marginBottom: "0",
              }}
            >
              View and manage all the skill tests you have created.
            </p>
          </div>

          {/* Button */}
          <div className="col-12 col-md-auto text-md-end">
            <button
              className="btn d-flex align-items-center justify-content-center"
              onClick={() => navigate("/examiner/create-assessment")}
              style={{
                padding: "10px 18px",
                borderRadius: "25px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                gap: "8px",
                width: "100%",
              }}
            >
              <i className="fas fa-plus"></i>
              Create New
            </button>
          </div>
        </div>
        {/* 3. Assessments Grid */}
        {loading ? (
          <h2
            style={{ textAlign: "center", marginTop: "50px", color: "#64748b" }}
          >
            Loading assessments...
          </h2>
        ) : (
          <div className="assessments-grid">
            {assessments.length === 0 ? (
              <div className="empty-state">
                <i
                  className="fas fa-folder-open"
                  style={{ fontSize: "3rem", color: "#cbd5e1" }}
                ></i>
                <h3>No Assessments Found</h3>
                <p>You haven't created any skill tests yet.</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/examiner/create-assessment")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Create Your First Assessment
                </button>
              </div>
            ) : (
              assessments.map((assessment) => (
                <div key={assessment._id} className="assessment-card">
                  <h3 className="text-white">{assessment.title}</h3>
                  <p>{assessment.description}</p>

                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "15px" }}
                  >
                    {/* HERE IS THE UPDATED BUTTON */}
                    <button
                      className="manage-btn"
                      style={{ flex: 1 }}
                      onClick={() =>
                        navigate(
                          `/examiner/manage-questions/${assessment._id}`,
                          {
                            state: { skillId: assessment.skillId },
                          },
                        )
                      }
                    >
                      <i className="fas fa-tasks"></i> Manage Questions
                    </button>

                    {!assessment.isPublished ? (
                      <button
                        style={{
                          flex: 1,
                          background: "#16a34a",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                        onClick={() => publishAssessment(assessment._id)}
                      >
                        <i className="fas fa-upload"></i> Publish
                      </button>
                    ) : (
                      <button
                        disabled
                        style={{
                          flex: 1,
                          background: "#6b7280",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px",
                        }}
                      >
                        ✔ Published
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AssessmentList;
