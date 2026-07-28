import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Make sure this matches your friend's actual import path!
import api from "../../services/api"; 
// Import teammate's global dashboard layout CSS + the new form CSS
import "./css/Dashboard.css"; 
import "./css/CreateAssessment.css";

const CreateAssessment = () => {
  const navigate = useNavigate();

  // Your friend's exact state
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
  });

  // Your friend's exact onChange handler
  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Your friend's exact submit handler
  const submit = async (e) => {
    e.preventDefault();
    try {
      // Sends the form data to the backend
      const res = await api.post("/examiner/assessment", form);
      alert("Assessment Created Successfully!");
      navigate("/examiner/assessments");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create assessment");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* 1. The Teammate's Sidebar (copied over so navigation works) */}
      <nav className="sidebar">
        <div className="sidebar-logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>URV</div>
        
        <button className="nav-item" onClick={() => navigate("/examiner/dashboard")} title="Dashboard">
          <i className="fas fa-home"></i>
        </button>
        
        <button className="nav-item active" onClick={() => navigate("/examiner/create-assessment")} title="Create Assessment">
          <i className="fas fa-plus-circle"></i>
        </button>
        
        <button className="nav-item" onClick={() => navigate("/examiner/assessments")} title="My Assessments">
          <i className="fas fa-list-ul"></i>
        </button>
        
        <div className="spacer"></div>
      </nav>

      {/* 2. Main Content Area */}
      <main className="dashboard-main">
        <div className="header-actions">
          <div className="dashboard-header" style={{ marginBottom: 0 }}>
            <h1>Create New Assessment</h1>
            <p>Define the parameters and rules for your new skill test.</p>
          </div>
          <button 
            className="logout-btn" 
            onClick={() => navigate("/examiner/dashboard")}
            style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', background: 'white' }}
          >
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>

        {/* 3. The Form Card */}
        <div className="form-card">
          <form onSubmit={submit}>
            
            <div className="form-group">
              <label>Assessment Title</label>
              <input 
                className="form-control"
                name="title" 
                placeholder="e.g. Advanced JavaScript Fundamentals" 
                value={form.title}
                onChange={change} 
                required
              />
            </div>

            <div className="form-group">
              <label>Description & Instructions</label>
              <textarea
                className="form-control"
                name="description"
                placeholder="Briefly describe what this assessment covers and any specific instructions for the candidates."
                value={form.description}
                onChange={change}
                required
              />
            </div>

            {/* A row for numerical settings */}
            <div className="form-row">
              <div className="form-group">
                <label>Duration (Minutes)</label>
                <input
                  className="form-control"
                  type="number"
                  name="duration"
                  placeholder="e.g. 60"
                  value={form.duration}
                  onChange={change}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Marks</label>
                <input
                  className="form-control"
                  type="number"
                  name="totalMarks"
                  placeholder="e.g. 100"
                  value={form.totalMarks}
                  onChange={change}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Passing Marks</label>
                <input
                  className="form-control"
                  type="number"
                  name="passingMarks"
                  placeholder="e.g. 40"
                  value={form.passingMarks}
                  onChange={change}
                  min="1"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <i className="fas fa-save"></i> Save & Create Assessment
            </button>
            
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateAssessment;