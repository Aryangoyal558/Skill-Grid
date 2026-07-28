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
      submitExam();
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
        `http://localhost:8081/question/${assessmentId}`,
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

  const submitExam = async () => {
    if (!window.confirm("Are you sure you want to submit your assessment?")) {
      return;
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
    <div className="take-assessment">
      <header className="exam-header">
        <h2>Online Assessment</h2>

        <div className="timer">⏰ {formatTime()}</div>
      </header>

      <div className="exam-body">
        <aside className="question-palette">
          <h3>Questions</h3>

          <div className="palette-grid">
            {questions.map((q, index) => (
              <button
                key={q._id}
                className={
                  currentQuestion === index
                    ? "palette-btn active"
                    : answers[q._id]
                      ? "palette-btn answered"
                      : "palette-btn"
                }
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </aside>

        <section className="question-section">
          <h3>
            Question {currentQuestion + 1} of {questions.length}
          </h3>

          <h2>{question.question}</h2>

          <div className="options">
            {question.options.map((option, index) => (
              <label key={index} className="option">
                <input
                  type="radio"
                  name={question._id}
                  value={option}
                  checked={answers[question._id] === option}
                  onChange={() => handleAnswer(question._id, option)}
                />

                {option}
              </label>
            ))}
          </div>

          <div className="navigation">
            <button onClick={previousQuestion} disabled={currentQuestion === 0}>
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button className="submit-btn" onClick={submitExam}>
                Submit Exam
              </button>
            ) : (
              <button onClick={nextQuestion}>Next</button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TakeAssessment;
