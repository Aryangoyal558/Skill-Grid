import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";

const Analytics = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:8081/analytics/dashboard", {
        withCredentials: true,
      });
      setStats(res.data.stats);
      setRecentAssessments(res.data.recentAssessments || []);
    } catch (err) {
      console.error("Failed to load analytics", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container w-100 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-container">
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #9333ea)",
          color: "#fff",
          padding: "24px 28px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "6px", color: "#ffffff" }}>
            Reports & Analytics 📊
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.85)", margin: 0 }}>
            Platform overview and assessment performance metrics.
          </p>
        </div>
      </div>

      <div className="dashboard-body">
        {/* KPI Cards */}
        <div className="kpi-cards-grid">
          <div className="kpi-card card-yellow">
            <div className="kpi-info">
              <span className="kpi-value">{stats?.totalAssessments || 0}</span>
              <span className="kpi-label">TOTAL ASSESSMENTS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-folder-open"></i>
            </div>
          </div>

          <div className="kpi-card card-purple">
            <div className="kpi-info">
              <span className="kpi-value">{stats?.publishedAssessments || 0}</span>
              <span className="kpi-label">PUBLISHED TESTS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-upload"></i>
            </div>
          </div>

          <div className="kpi-card card-cyan">
            <div className="kpi-info">
              <span className="kpi-value">{stats?.totalQuestions || 0}</span>
              <span className="kpi-label">BANK QUESTIONS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-database"></i>
            </div>
          </div>

          <div className="kpi-card card-pink">
            <div className="kpi-info">
              <span className="kpi-value">{stats?.totalCandidates || 0}</span>
              <span className="kpi-label">REGISTERED CANDIDATES</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-users"></i>
            </div>
          </div>
        </div>

        {/* Assessment Overview Table Card */}
        <div className="content-grid-row full-width mt-4">
          <div className="dashboard-card w-100">
            <div className="card-header border-bottom border-secondary border-opacity-10 pb-3 mb-3">
              <h3 className="m-0 d-flex align-items-center gap-2 text-white" style={{ fontSize: "18px", fontWeight: "700" }}>
                <i className="fa-solid fa-chart-bar text-info"></i>
                Recent Assessments Overview
              </h3>
            </div>

            <div className="card-body p-0">
              {recentAssessments.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fa-solid fa-inbox d-block mb-2 fs-2 opacity-50"></i>
                  <p className="m-0">No assessments created yet.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {recentAssessments.map((test) => (
                    <div
                      key={test._id}
                      className="d-flex justify-content-between align-items-center p-3 rounded"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <i className="fa-solid fa-file-lines text-info fs-4"></i>
                        <div>
                          <strong className="text-white d-block fs-6">{test.title}</strong>
                          <span className="text-muted" style={{ fontSize: "12px" }}>
                            Category: {test.skillId ? test.skillId.name : "Uncategorized"} | Total Marks: {test.totalMarks}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span
                          className={`badge ${
                            test.isPublished
                              ? "bg-success bg-opacity-25 text-success border border-success border-opacity-25"
                              : "bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-25"
                          } px-3 py-2`}
                        >
                          {test.isPublished ? "Active / Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;