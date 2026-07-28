import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ManageQuestions = () => {
  const { assessmentId } = useParams();

  const [questions, setQuestions] = useState([]);

  const [question, setQuestion] = useState("");

  const [options, setOptions] = useState(["", "", "", ""]);

  const [correctAnswer, setCorrectAnswer] = useState("");

  const [marks, setMarks] = useState(1);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

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
      console.log(err);
    }
  };

  const handleOptionChange = (index, value) => {
    const temp = [...options];

    temp[index] = value;

    setOptions(temp);
  };

  const startEdit = (item) => {
    setEditingId(item._id);

    setQuestion(item.question);

    setOptions(item.options);

    setCorrectAnswer(item.correctAnswer);

    setMarks(item.marks);
  };

  const addQuestion = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingId) {
        await axios.put(
          `http://localhost:8081/question/${editingId}`,

          {
            question,

            options,

            correctAnswer,

            marks,
          },

          {
            withCredentials: true,
          },
        );

        alert("Question Updated");
      } else {
        await axios.post(
          "http://localhost:8081/question",

          {
            assessment: assessmentId,

            question,

            options,

            correctAnswer,

            marks,
          },

          {
            withCredentials: true,
          },
        );

        alert("Question Added");
      }

      setEditingId(null);

      setQuestion("");

      setOptions(["", "", "", ""]);

      setCorrectAnswer("");

      setMarks(1);

      loadQuestions();
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await axios.delete(`http://localhost:8081/question/${id}`, {
        withCredentials: true,
      });

      loadQuestions();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="manage-question-page">
      <h1>Manage Questions</h1>

      <hr />

      <form onSubmit={addQuestion}>
        <h2>Add Question</h2>

        <textarea
          placeholder="Enter Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <input
          type="text"
          placeholder="Option A"
          value={options[0]}
          onChange={(e) => handleOptionChange(0, e.target.value)}
        />

        <input
          type="text"
          placeholder="Option B"
          value={options[1]}
          onChange={(e) => handleOptionChange(1, e.target.value)}
        />

        <input
          type="text"
          placeholder="Option C"
          value={options[2]}
          onChange={(e) => handleOptionChange(2, e.target.value)}
        />

        <input
          type="text"
          placeholder="Option D"
          value={options[3]}
          onChange={(e) => handleOptionChange(3, e.target.value)}
        />

        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        >
          <option value="">Correct Answer</option>

          <option value="0">Option A</option>

          <option value="1">Option B</option>

          <option value="2">Option C</option>

          <option value="3">Option D</option>
        </select>

        <input
          type="number"
          min="1"
          value={marks}
          onChange={(e) => setMarks(Number(e.target.value))}
        />

        <button disabled={loading}>
          {editingId ? "Update Question" : "Add Question"}
        </button>
      </form>

      <hr />

      <h2>Questions</h2>

      {questions.length === 0 ? (
        <h3>No Questions Added</h3>
      ) : (
        questions.map((item, index) => (
          <div
            key={item._id}
            style={{
              border: "1px solid gray",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>
              Q{index + 1}. {item.question}
            </h3>

            <p>A. {item.options[0]}</p>

            <p>B. {item.options[1]}</p>

            <p>C. {item.options[2]}</p>

            <p>D. {item.options[3]}</p>

            <p>
              <strong>Correct Answer :</strong> {item.correctAnswer}
            </p>

            <p>
              <strong>Marks :</strong> {item.marks}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => navigate(`/examiner/question/edit/${item._id}`)}
              >
                Edit
              </button>

              <button onClick={() => deleteQuestion(item._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageQuestions;
