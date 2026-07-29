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
        <div className="sidebar-logo" style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>URV</div>
        <button className="nav-item" onClick={() => navigate("/examiner/dashboard")} title="Dashboard">
          <i className="fas fa-home"></i>
        </button>
        <button className="nav-item" onClick={() => navigate("/examiner/create-assessment")} title="Create Assessment">
          <i className="fas fa-plus-circle"></i>
        </button>
        <button className="nav-item active" onClick={() => navigate("/examiner/assessments")} title="My Assessments">
          <i className="fas fa-list-ul"></i>
        </button>
        <div className="spacer"></div>
      </nav>

      {/* 2. Main Content Area */}
      <main className="dashboard-main">
        <div className="header-actions">
          <div className="dashboard-header" style={{ marginBottom: 0 }}>
            <h1>My Assessments</h1>
            <p>View and manage all the skill tests you have created.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/examiner/create-assessment")} style={{ padding: "12px 24px", borderRadius: "8px", background: "#2563eb", color: "white", border: "none", fontWeight: "bold", cursor: "pointer" }}>
            <i className="fas fa-plus"></i> Create New
          </button>
        </div>

        {/* 3. Assessments Grid */}
        {loading ? (
          <h2 style={{ textAlign: "center", marginTop: "50px", color: "#64748b" }}>Loading assessments...</h2>
        ) : (
          <div className="assessments-grid">
            {assessments.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-folder-open" style={{ fontSize: "3rem", color: "#cbd5e1" }}></i>
                <h3>No Assessments Found</h3>
                <p>You haven't created any skill tests yet.</p>
                <button className="btn-primary" onClick={() => navigate("/examiner/create-assessment")} style={{ padding: "10px 20px", borderRadius: "8px", background: "#2563eb", color: "white", border: "none", cursor: "pointer" }}>
                  Create Your First Assessment
                </button>
              </div>
            ) : (
              assessments.map((assessment) => (
                <div key={assessment._id} className="assessment-card">
                  <h3>{assessment.title}</h3>
                  <p>{assessment.description}</p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    
                    {/* HERE IS THE UPDATED BUTTON */}
                    <button
                      className="manage-btn"
                      style={{ flex: 1 }}
                      onClick={() =>
                        navigate(`/examiner/manage-questions/${assessment._id}`, { 
                          state: { skillId: assessment.skillId } 
                        })
                      }
                    >
                      <i className="fas fa-tasks"></i> Manage Questions
                    </button>

                    {!assessment.isPublished ? (
                      <button style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", cursor: "pointer", fontWeight: "600" }} onClick={() => publishAssessment(assessment._id)}>
                        <i className="fas fa-upload"></i> Publish
                      </button>
                    ) : (
                      <button disabled style={{ flex: 1, background: "#6b7280", color: "#fff", border: "none", borderRadius: "8px", padding: "10px" }}>
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