import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";
import "./css/SelectSkill.css";

const SelectSkill = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // New state to toggle the "Add Skill" form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get("http://localhost:8081/skill", {
        withCredentials: true,
      });
      setSkills(res.data.skills);
    } catch (err) {
      console.error("Failed to load skills", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSkill = (skill) => {
    navigate("/examiner/create-assessment-form", {
      state: { skillId: skill._id, skillName: skill.name },
    });
  };

  // Function to save a brand new skill to the database
  const handleCreateNewSkill = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/skill", newSkill, {
        withCredentials: true,
      });
      // Add the new skill to the screen immediately
      setSkills([...skills, res.data.skill]);
      // Reset and hide the form
      setNewSkill({ name: "", description: "" });
      setShowAddForm(false);
    } catch (err) {
      alert("Failed to create new category.");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
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
          className="nav-item active"
          onClick={() => navigate("/examiner/create-assessment")}
          title="Create Assessment"
        >
          <i className="fas fa-plus-circle"></i>
        </button>
        <button
          className="nav-item"
          onClick={() => navigate("/examiner/assessments")}
          title="My Assessments"
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <div className="spacer"></div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div
          className="d-flex justify-content-between align-items-center flex-wrap"
          style={{
            background: "linear-gradient(135deg, #4f46e5, #9333ea)",
            color: "#fff",
            padding: "25px 30px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            marginBottom: "20px",
            gap: "10px",
          }}
        >
          {/* Left Content */}
          <div className="col-12 col-md-8 p-0">
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              Select Assessment Skill
            </h1>

            <p
              style={{
                fontSize: "14px",
                opacity: "0.4",
                marginBottom: "0",
              }}
            >
              Choose the technology or subject area for your new assessment.
            </p>
          </div>
        </div>

        {/* The New Skill Form (Hidden by default) */}
        {showAddForm && (
          <div
            className="form-card"
            style={{
              marginBottom: "30px",
              padding: "20px",
              border: "2px dashed #2563eb",
            }}
          >
            <h3>Create New Category</h3>
            <form onSubmit={handleCreateNewSkill}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  className="form-control"
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                  placeholder="e.g. Mathematics"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  className="form-control"
                  value={newSkill.description}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, description: e.target.value })
                  }
                  placeholder="Briefly describe this category"
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  className="submit-btn"
                  style={{ width: "auto", padding: "10px 20px" }}
                >
                  Save Category
                </button>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    width: "auto",
                    padding: "10px 20px",
                    background: "#f1f5f9",
                    color: "#0f172a",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <h2>Loading subjects...</h2>
        ) : (
          <div className="skills-grid">
            {/* 1. Map through dynamic database skills */}
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="skill-card"
                onClick={() => handleSelectSkill(skill)}
              >
                <div className="skill-icon">
                  <i className="fas fa-laptop-code"></i>
                </div>
                <h3>{skill.name}</h3>
                <p>{skill.description}</p>
              </div>
            ))}

            {/* 2. Permanent "General / Uncategorized" Card */}
            <div
              className="skill-card"
              onClick={() =>
                handleSelectSkill({ _id: null, name: "Uncategorized" })
              }
            >
              <div
                className="skill-icon"
                style={{ background: "#f1f5f9", color: "#64748b" }}
              >
                <i className="fas fa-folder-open"></i>
              </div>
              <h3 className="text-white">Uncategorized</h3>
              <p>Standard assessment without a specific subject category.</p>
            </div>

            {/* 3. Permanent "Create New" Card */}
            <div
              className="skill-card"
              onClick={() => setShowAddForm(true)}
              style={{ border: "2px dashed #cbd5e1" }}
            >
              <div
                className="skill-icon"
                style={{ background: "transparent", color: "#cbd5e1" }}
              >
                <i className="fas fa-plus"></i>
              </div>
              <h3 style={{ color: "#64748b" }}>Add New Skill</h3>
              <p>Create a brand new subject category for the platform.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SelectSkill;
