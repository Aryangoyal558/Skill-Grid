import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";

const Analytics = () => {
  const navigate = useNavigate();

  // Data States
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [skillCategory, setSkillCategory] = useState("");
  const [assessmentFilter, setAssessmentFilter] = useState("");

  // Dropdown Options
  const [skills, setSkills] = useState([]);
  const [assessmentsList, setAssessmentsList] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    fetchFilters();
  }, [dateRange, skillCategory, assessmentFilter]);

  const fetchFilters = async () => {
    try {
      // Fetch skills and assessments to populate the filter dropdowns
      const [skillsRes, assessRes] = await Promise.all([
        axios.get("http://localhost:8081/skill", { withCredentials: true }),
        axios.get("http://localhost:8081/examiner/assessments", { withCredentials: true })
      ]);
      setSkills(skillsRes.data.skills || []);
      setAssessmentsList(assessRes.data.assessments || []);
    } catch (err) {
      console.log("Could not load filters", err);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Pass filters as query parameters
      const queryParams = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        skillId: skillCategory,
        assessmentId: assessmentFilter
      }).toString();

      const res = await axios.get(`http://localhost:8081/analytics/dashboard?${queryParams}`, {
        withCredentials: true,
      });
      
      setStats(res.data.stats);
      setPerformanceData(res.data.performanceData || []);
    } catch (err) {
      console.error("Failed to load analytics", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // FR-8.1: Export Data as CSV
  const exportToCSV = () => {
    if (performanceData.length === 0) return alert("No data to export");

    const headers = ["Candidate Name", "Assessment Title", "Category", "Score", "Result", "Date"];
    const rows = performanceData.map(row => [
      row.candidateName,
      row.assessmentTitle,
      row.category,
      row.score,
      row.result, // Pass or Fail
      new Date(row.date).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Assessment_Analytics_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            Evaluate assessment effectiveness, identify skill gaps, and track certification trends.
          </p>
        </div>
        <div>
          <button onClick={exportToCSV} className="btn btn-light rounded-pill px-4 fw-bold shadow-sm">
            <i className="fa-solid fa-file-csv me-2"></i> Export CSV
          </button>
        </div>
      </div>

      <div className="dashboard-body">
        
        {/* FR-8.1: Filter Row */}
        <div className="d-flex flex-wrap gap-3 mb-4 p-3 rounded" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div className="d-flex align-items-center gap-2">
             <span className="text-white small fw-bold">From:</span>
             <input type="date" className="form-control form-control-sm bg-dark text-white border-secondary" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
          </div>
          <div className="d-flex align-items-center gap-2">
             <span className="text-white small fw-bold">To:</span>
             <input type="date" className="form-control form-control-sm bg-dark text-white border-secondary" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
          </div>
          <select className="form-select form-select-sm bg-dark text-white border-secondary" style={{ width: 'auto' }} value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)}>
            <option value="">All Skill Categories</option>
            {skills.map(skill => <option key={skill._id} value={skill._id}>{skill.name}</option>)}
          </select>
          <select className="form-select form-select-sm bg-dark text-white border-secondary" style={{ width: 'auto' }} value={assessmentFilter} onChange={(e) => setAssessmentFilter(e.target.value)}>
            <option value="">All Assessments</option>
            {assessmentsList.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="loading-container w-100 d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading Analytics...</span>
            </div>
          </div>
        ) : (
          <>
            {/* FR-8.1: Required KPI Cards */}
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

              <div className="kpi-card card-pink">
                <div className="kpi-info">
                  <span className="kpi-value">{stats?.totalCandidates || 0}</span>
                  <span className="kpi-label">TOTAL CANDIDATES</span>
                </div>
                <div className="kpi-icon-wrap">
                  <i className="fa-solid fa-users"></i>
                </div>
              </div>

              <div className="kpi-card card-purple">
                <div className="kpi-info">
                  <span className="kpi-value">{stats?.passRate || 0}%</span>
                  <span className="kpi-label">AVERAGE PASS RATE</span>
                </div>
                <div className="kpi-icon-wrap">
                  <i className="fa-solid fa-chart-pie"></i>
                </div>
              </div>

              <div className="kpi-card card-cyan">
                <div className="kpi-info">
                  <span className="kpi-value">{stats?.certificatesIssued || 0}</span>
                  <span className="kpi-label">CERTIFICATES ISSUED</span>
                </div>
                <div className="kpi-icon-wrap">
                  <i className="fa-solid fa-award"></i>
                </div>
              </div>
            </div>

            {/* FR-8.1: Performance Summary Table */}
            <div className="content-grid-row full-width mt-4">
              <div className="dashboard-card w-100">
                <div className="card-header border-bottom border-secondary border-opacity-10 pb-3 mb-3">
                  <h3 className="m-0 d-flex align-items-center gap-2 text-white" style={{ fontSize: "18px", fontWeight: "700" }}>
                    <i className="fa-solid fa-list-check text-info"></i>
                    Candidate Performance Summary
                  </h3>
                </div>

                <div className="card-body p-0">
                  {performanceData.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="fa-solid fa-inbox d-block mb-2 fs-2 opacity-50"></i>
                      <p className="m-0">No performance data found for these filters.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-dark table-hover align-middle mb-0" style={{ background: "transparent" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                            <th className="text-uppercase text-muted small pb-3">Candidate</th>
                            <th className="text-uppercase text-muted small pb-3">Assessment</th>
                            <th className="text-uppercase text-muted small pb-3">Date</th>
                            <th className="text-uppercase text-muted small pb-3 text-center">Score</th>
                            <th className="text-uppercase text-muted small pb-3 text-end">Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {performanceData.map((row, index) => (
                            <tr key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td className="py-3 text-white fw-bold">{row.candidateName}</td>
                              <td className="py-3 text-light">{row.assessmentTitle} <br/><small className="text-muted">{row.category}</small></td>
                              <td className="py-3 text-light">{new Date(row.date).toLocaleDateString()}</td>
                              <td className="py-3 text-center fw-bold">{row.score}</td>
                              <td className="py-3 text-end">
                                <span className={`badge ${row.result === 'Pass' ? 'bg-success text-success' : 'bg-danger text-danger'} bg-opacity-25 border border-${row.result === 'Pass' ? 'success' : 'danger'} border-opacity-25 px-3 py-2`}>
                                  {row.result}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;