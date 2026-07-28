import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./css/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    assessments: 0,
    questions: 0,
    certificates: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/examiner/dashboard");

      setStats(res.data.stats);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard">
      <h1>Examiner Dashboard</h1>

      <div className="stats">
        <div className="card">
          <h2>{stats.students}</h2>
          <p>Total Students</p>
        </div>

        <div className="card">
          <h2>{stats.assessments}</h2>
          <p>Assessments</p>
        </div>

        <div className="card">
          <h2>{stats.questions}</h2>
          <p>Questions</p>
        </div>

        <div className="card">
          <h2>{stats.certificates}</h2>
          <p>Certificates</p>
        </div>
      </div>

      <button onClick={() => navigate("/examiner/create-assessment")}>
        Create Assessment
      </button>

      <button onClick={() => navigate("/examiner/assessments")}>
        My Assessments
      </button>
    </div>
  );
};

export default Dashboard;
