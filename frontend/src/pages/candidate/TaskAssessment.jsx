import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const TakeAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);

  // 30 Minutes Timer
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (timeLeft <= 0) {
      submitExam(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const loadQuestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/question/assessment/${assessmentId}`,
        {
          withCredentials: true,
        },
      );

      setQuestions(res.data.questions);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitExam = async (autoSubmit = false) => {
    if (!autoSubmit) {
      const ok = window.confirm("Are you sure you want to submit?");

      if (!ok) return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8081/result",
        {
          assessment: assessmentId,
          answers,
        },
        {
          withCredentials: true,
        },
      );

      alert(res.data.message);

      navigate("/candidate/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        Loading Questions...
      </h2>
    );
  }

  if (questions.length === 0) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        No Questions Found
      </h2>
    );
  }

  const question = questions[currentQuestion];
  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      {/* Header Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-1">📝 Online Assessment</h2>
            <p className="text-muted mb-0">
              Complete all questions before time runs out
            </p>
          </div>

          <div className="badge bg-danger fs-5 px-4 py-3">
            ⏰ {formatTime()}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Question Palette */}
        <div className="col-lg-3 col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Questions</h5>
            </div>

            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q._id}
                    className={`btn rounded-circle 
                    ${
                      currentQuestion === index
                        ? "btn-primary"
                        : answers[q._id]
                          ? "btn-success"
                          : "btn-outline-secondary"
                    }`}
                    style={{
                      width: "45px",
                      height: "45px",
                    }}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <hr />

              <div className="small">
                <p>
                  <span className="badge bg-primary">Current</span>
                </p>

                <p>
                  <span className="badge bg-success">Answered</span>
                </p>

                <p>
                  <span className="badge bg-secondary">Not Attempted</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="col-lg-9 col-md-8">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <div className="mb-4">
                <span className="badge bg-dark fs-6">
                  Question {currentQuestion + 1} / {questions.length}
                </span>
              </div>

              <h3 className="fw-bold mb-4">{question.question}</h3>

              <div className="d-flex flex-column gap-3">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`card p-3 option-card 
                    ${
                      answers[question._id] === option
                        ? "border-primary bg-primary-subtle"
                        : ""
                    }`}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={question._id}
                        value={option}
                        checked={answers[question._id] === option}
                        onChange={() => handleAnswer(question._id, index)}
                      />

                      <span className="ms-2">{option}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Navigation Buttons */}

              <div className="d-flex justify-content-between mt-5">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                >
                  ← Previous
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <button className="btn btn-success px-4" onClick={submitExam}>
                    Submit Exam ✓
                  </button>
                ) : (
                  <button
                    className="btn btn-primary px-4"
                    onClick={nextQuestion}
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeAssessment;
