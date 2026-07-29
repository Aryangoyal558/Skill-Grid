import { useEffect, useState } from "react";
import axios from "axios";
import "./css/Dashboard.css";

function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [candidateId, setCandidateId] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [candidateRes, assessmentRes, assignmentRes] = await Promise.all([
        axios.get("http://localhost:8081/admin/candidates", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8081/admin/assessments", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8081/admin/assignments", {
          withCredentials: true,
        }),
      ]);

      setCandidates(candidateRes.data.candidates || []);
      setAssessments(assessmentRes.data.assessments || []);
      setAssignments(assignmentRes.data.assignments || []);
    } catch (err) {
      console.error(err);
    }
  };

  const assignAssessment = async () => {
    if (!candidateId || !assessmentId) {
      return alert("Please select candidate and assessment.");
    }

    try {
      await axios.post(
        "http://localhost:8081/admin/assign",
        {
          candidateId,
          assessmentId,
          dueDate,
        },
        {
          withCredentials: true,
        },
      );

      alert("Assessment Assigned Successfully");

      setCandidateId("");
      setAssessmentId("");
      setDueDate("");

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Assignment Failed");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Statistics */}
      <div className="cards">
        <div className="card">
          <div className="icon">👨‍🎓</div>
          <h3>Candidates</h3>
          <h2>{candidates.length}</h2>
        </div>

        <div className="card">
          <div className="icon">📝</div>
          <h3>Assessments</h3>
          <h2>{assessments.length}</h2>
        </div>

        <div className="card">
          <div className="icon">📋</div>
          <h3>Assignments</h3>
          <h2>{assignments.length}</h2>
        </div>

        <div className="card">
          <div className="icon">🏆</div>
          <h3>Completed</h3>
          <h2>{assignments.filter((a) => a.status === "Completed").length}</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Side */}
        <div>
          {/* Candidate Table */}
          <div className="dashboard-box">
            <h2>Candidates</h2>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Assign</th>
                </tr>
              </thead>

              <tbody>
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan="3">No Candidates Found</td>
                  </tr>
                ) : (
                  candidates.map((candidate) => (
                    <tr key={candidate._id}>
                      <td>{candidate.name}</td>
                      <td>{candidate.email}</td>
                      <td>
                        <button
                          className="assign-btn"
                          onClick={() => setCandidateId(candidate._id)}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Assignment Form */}
          <div className="dashboard-box">
            <h2>Assign Assessment</h2>

            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
            >
              <option value="">Select Candidate</option>

              {candidates.map((candidate) => (
                <option key={candidate._id} value={candidate._id}>
                  {candidate.name}
                </option>
              ))}
            </select>

            <select
              value={assessmentId}
              onChange={(e) => setAssessmentId(e.target.value)}
            >
              <option value="">Select Assessment</option>

              {assessments.map((assessment) => (
                <option key={assessment._id} value={assessment._id}>
                  {assessment.title}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button className="primary-btn" onClick={assignAssessment}>
              Assign Assessment
            </button>
          </div>

          {/* Published Assessments */}
          <div className="dashboard-box">
            <h2>Published Assessments</h2>

            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Passing Marks</th>
                </tr>
              </thead>

              <tbody>
                {assessments.length === 0 ? (
                  <tr>
                    <td colSpan="3">No Published Assessments</td>
                  </tr>
                ) : (
                  assessments.map((assessment) => (
                    <tr key={assessment._id}>
                      <td>{assessment.title}</td>
                      <td>{assessment.duration} mins</td>
                      <td>{assessment.passingMarks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side */}
        <div>
          <div className="dashboard-box">
            <h2>Assignment History</h2>

            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Assessment</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>

              <tbody>
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan="4">No Assignments</td>
                  </tr>
                ) : (
                  assignments.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.candidate?.name || item.candidate?.fullname}
                      </td>

                      <td>{item.assessment?.title}</td>

                      <td>
                        <span className={item.status}>{item.status}</span>
                      </td>

                      <td>
                        {item.dueDate
                          ? new Date(item.dueDate).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
