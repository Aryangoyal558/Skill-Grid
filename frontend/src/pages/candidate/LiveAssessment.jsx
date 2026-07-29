import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./css/Dashboard.css";
import axios from "axios";

const LiveAssessment = () => {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidateDashboardData();
  }, []);

  const fetchCandidateDashboardData = async () => {
    try {
      // Fetch user profile first

      // Fetch optional dashboard lists safely
      const [assessmentsRes] = await Promise.allSettled([
        axios.get("http://localhost:8081/candidate/assessments", {
          withCredentials: true,
        }),
      ]);

      if (assessmentsRes.status === "fulfilled") {
        setAssessments(assessmentsRes.value.data.assessments || []);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading Dashboard...
      </h2>
    );
  }

  return (
    <div className="col-md-7 pb-2">
      <div className="dashboard-card">
        <h2 className="text-xl font-bold mb-2">Available Skill Assessments</h2>
        <p className="text-gray-600 mb-4">
          Select an assessment to start your evaluation.
        </p>

        {assessments.length === 0 ? (
          <p className="text-slate-500 italic">
            No published assessments available right now.
          </p>
        ) : (
          <div className="space-y-3">
            {assessments.map((test) => (
              <div
                key={test._id}
                className="list-item flex justify-between items-center p-3 border rounded-lg"
              >
                <div className="list-item-left flex items-center gap-3">
                  <i className="fas fa-code text-blue-600 text-xl"></i>
                  <div>
                    <strong className="block text-slate-800">
                      {test.title}
                    </strong>
                    <p className="text-xs text-slate-500">
                      Duration: {test.timeLimit} mins | Passing Score:{" "}
                      {test.minPassScore}%
                    </p>
                  </div>
                </div>
                {test.attempted ? (
                  <button
                    disabled
                    className="bg-gray-400 text-white text-xs font-semibold px-3 py-2 rounded-md cursor-not-allowed"
                  >
                    Completed ✓
                  </button>
                ) : (
                  <Link
                    to={`/candidate/assessment/${test._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-md"
                  >
                    Start Test
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAssessment;
