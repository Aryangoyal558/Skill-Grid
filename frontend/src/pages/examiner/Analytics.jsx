import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Assuming you use the same Dashboard CSS file
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
      setRecentAssessments(res.data.recentAssessments);
    } catch (err) {
      console.error("Failed to load analytics", err);
      // Optional: handle auth failure
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Loading Analytics...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* 1. Global Examiner Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-logo" style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>URV</div>
        <button className="nav-item" onClick={() => navigate("/examiner/dashboard")} title="Dashboard"><i className="fas fa-home"></i></button>
        <button className="nav-item" onClick={() => navigate("/examiner/create-assessment")} title="Create Assessment"><i className="fas fa-plus-circle"></i></button>
        <button className="nav-item" onClick={() => navigate("/examiner/assessments")} title="My Assessments"><i className="fas fa-list-ul"></i></button>
        <button className="nav-item active" onClick={() => navigate("/examiner/analytics")} title="Reports & Analytics"><i className="fas fa-chart-line"></i></button>
        <div className="spacer"></div>
      </nav>

      {/* 2. Main Content Area using your Page Container Style */}
      <main className="dashboard-main dashboard-page-container" style={{ padding: '20px', width: '100%' }}>
        
        <div className="dashboard-header-title" style={{ marginBottom: '30px' }}>
          <h1>REPORTS & ANALYTICS</h1>
          <p style={{ color: '#64748b', marginTop: '5px' }}>Platform overview and assessment performance metrics.</p>
        </div>

        <div className="dashboard-body">
          {/* KPI Cards Row (Using your exact CSS classes) */}
          <div className="kpi-cards-grid">
            
            {/* Total Assessments */}
            <div className="kpi-card card-yellow">
              <div className="kpi-info">
                <span className="kpi-value">{stats?.totalAssessments || 0}</span>
                <span className="kpi-label">TOTAL ASSESSMENTS</span>
              </div>
              <div className="kpi-icon-wrap">
                <i className="fas fa-folder-open"></i>
              </div>
            </div>

            {/* Published Tests */}
            <div className="kpi-card card-purple">
              <div className="kpi-info">
                <span className="kpi-value">{stats?.publishedAssessments || 0}</span>
                <span className="kpi-label">PUBLISHED TESTS</span>
              </div>
              <div className="kpi-icon-wrap">
                <i className="fas fa-upload"></i>
              </div>
            </div>

            {/* Question Bank */}
            <div className="kpi-card card-cyan">
              <div className="kpi-info">
                <span className="kpi-value">{stats?.totalQuestions || 0}</span>
                <span className="kpi-label">BANK QUESTIONS</span>
              </div>
              <div className="kpi-icon-wrap">
                <i className="fas fa-database"></i>
              </div>
            </div>

            {/* Registered Candidates */}
            <div className="kpi-card card-pink">
              <div className="kpi-info">
                <span className="kpi-value">{stats?.totalCandidates || 0}</span>
                <span className="kpi-label">REGISTERED CANDIDATES</span>
              </div>
              <div className="kpi-icon-wrap">
                <i className="fas fa-users"></i>
              </div>
            </div>
          </div>

          {/* Full-width Content Row for the Data Table */}
          <div className="content-grid-row full-width" style={{ marginTop: '30px' }}>
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-chart-bar card-title-icon"></i> Recent Assessments Overview
                </h3>
                <div className="card-controls">
                  <span>+</span>
                  <span>×</span>
                </div>
              </div>
              
              <div className="card-body">
                {recentAssessments.length === 0 ? (
                  <div className="empty-state" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '10px' }}></i>
                    <p>No assessments created yet.</p>
                  </div>
                ) : (
                  <div className="items-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {recentAssessments.map((test) => (
                      <div key={test._id} className="list-item-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                        <div className="list-item-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <i className="fas fa-file-alt item-icon" style={{ fontSize: '24px', color: '#3b82f6' }}></i>
                          <div>
                            <strong className="item-title" style={{ fontSize: '1.1rem', color: '#1e293b' }}>{test.title}</strong>
                            <p className="item-subtext" style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                              Category: {test.skillId ? test.skillId.name : "Uncategorized"} | Total Marks: {test.totalMarks}
                            </p>
                          </div>
                        </div>
                        <div className="list-item-action">
                          <span style={{
                            padding: '6px 12px', 
                            borderRadius: '20px', 
                            fontSize: '0.85rem', 
                            fontWeight: 'bold', 
                            background: test.isPublished ? '#dcfce7' : '#f1f5f9', 
                            color: test.isPublished ? '#16a34a' : '#64748b'
                          }}>
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
      </main>
    </div>
  );
};

export default Analytics;