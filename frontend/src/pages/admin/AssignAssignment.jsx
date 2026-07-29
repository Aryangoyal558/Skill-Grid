import { useEffect, useState } from "react";
import api from "../../service/api";

function AssignAssignment() {
  const [candidates, setCandidates] = useState([]);

  const [assessments, setAssessments] = useState([]);

  const [candidate, setCandidate] = useState("");

  const [assessment, setAssessment] = useState("");

  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const c = await api.get("/admin/candidates");
    console.log(c.data.candidates);

    const a = await api.get("/admin/assessments");

    setCandidates(c.data.candidates);

    setAssessments(a.data.assessments);
  };

  const assign = async () => {
    await api.post("/admin/assign", {
      candidateId: candidate,

      assessmentId: assessment,

      dueDate,
    });

    alert("Assigned Successfully");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Assign Assessment</h2>

      <select
        className="border p-2 w-full mb-4"
        onChange={(e) => setCandidate(e.target.value)}
      >
        <option>Select Candidate</option>

        {candidates.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        className="border p-2 w-full mb-4"
        onChange={(e) => setAssessment(e.target.value)}
      >
        <option>Select Assessment</option>

        {assessments.map((a) => (
          <option key={a._id} value={a._id}>
            {a.title}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="border p-2 w-full mb-4"
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button
        onClick={assign}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Assign Assessment
      </button>
    </div>
  );
}

export default AssignAssignment;
