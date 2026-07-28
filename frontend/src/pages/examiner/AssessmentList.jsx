import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AssessmentList = () => {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    getAssessments();
  }, []);

  const getAssessments = async () => {
    const res = await axios.get(
      "http://localhost:8081/examiner/my",

      {
        withCredentials: true,
      },
    );

    setAssessments(res.data.assessments);
  };

  return (
    <div>
      <h1>My Assessments</h1>

      {assessments.map((assessment) => (
        <div
          key={assessment._id}
          style={{
            border: "1px solid gray",
            margin: "20px",
            padding: "20px",
          }}
        >
          <h3>{assessment.title}</h3>

          <p>{assessment.description}</p>

          <button
            onClick={() => navigate(`/examiner/questions/${assessment._id}`)}
          >
            Manage Questions
          </button>
        </div>
      ))}
    </div>
  );
};

export default AssessmentList;
