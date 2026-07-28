import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css"; // Global dashboard layout
import "./css/ManageQuestions.css"; // Specific layout for this page

const ManageQuestions = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

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
        { withCredentials: true }
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
    setCorrectAnswer(item.correctAnswer.toString()); // Ensure it sets the dropdown correctly
    setMarks(item.marks);
    
    // UX boost: Scroll the user to the top of the page so they see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingId) {
        await axios.put(
          `http://localhost:8081/question/${editingId}`,
          { question, options, correctAnswer: Number(correctAnswer), marks },
          { withCredentials: true }
        );
        alert("Question Updated Successfully!");
      } else {
        await axios.post(
          "http://localhost:8081/question",
          { assessment: assessmentId, question, options, correctAnswer: Number(correctAnswer), marks },
          { withCredentials: true }
        );
        alert("Question Added Successfully!");
      }

      // Reset form
      setEditingId(null);
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setMarks(1);
      loadQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`http://localhost:8081/question/${id}`, {
        withCredentials: true,
      });
      loadQuestions();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setMarks(1);
  };

  return (
    <div className="dashboard-layout">
      {/* 1. Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>URV</div>
        <button className="nav-item" onClick={() => navigate("/examiner/dashboard")} title="Dashboard"><i className="fas fa-home"></i></button>
        <button className="nav-item" onClick={() => navigate("/examiner/create-assessment")} title="Create Assessment"><i className="fas fa-plus-circle"></i></button>
        <button className="nav-item active" onClick={() => navigate("/examiner/assessments")} title="My Assessments"><i className="fas fa-list-ul"></i></button>
        <div className="spacer"></div>
      </nav>

      {/* 2. Main Content */}
      <main className="dashboard-main">
        <div className="header-actions">
          <div className="dashboard-header" style={{ marginBottom: 0 }}>
            <h1>Manage Questions</h1>
            <p>Add, edit, or remove questions for this assessment.</p>
          </div>
          <button 
            className="btn-secondary" 
            onClick={() => navigate("/examiner/assessments")}
            style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: 'white' }}
          >
            <i className="fas fa-arrow-left"></i> Back to Assessments
          </button>
        </div>

        <div className="manage-container mt-4">
          
          {/* TOP SECTION: The Add/Edit Form */}
          <div className="question-form-card" style={{ borderColor: editingId ? '#f59e0b' : '#2563eb' }}>
            <h2>{editingId ? "✏️ Edit Question" : "➕ Add New Question"}</h2>

            <form onSubmit={addQuestion}>
              <div className="form-group">
                <label>Question Text</label>
                <textarea
                  className="form-control"
                  placeholder="Enter the question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Options</label>
              <div className="options-grid">
                <input className="form-control" placeholder="Option A" value={options[0]} onChange={(e) => handleOptionChange(0, e.target.value)} required />
                <input className="form-control" placeholder="Option B" value={options[1]} onChange={(e) => handleOptionChange(1, e.target.value)} required />
                <input className="form-control" placeholder="Option C" value={options[2]} onChange={(e) => handleOptionChange(2, e.target.value)} required />
                <input className="form-control" placeholder="Option D" value={options[3]} onChange={(e) => handleOptionChange(3, e.target.value)} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Correct Answer</label>
                  <select
                    className="form-control"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select correct option...</option>
                    <option value="0">Option A</option>
                    <option value="1">Option B</option>
                    <option value="2">Option C</option>
                    <option value="3">Option D</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marks</label>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 25px', borderRadius: '8px', border: 'none', background: editingId ? '#f59e0b' : '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
                  {loading ? "Saving..." : (editingId ? "Update Question" : "Add Question")}
                </button>

                {editingId && (
                  <button type="button" onClick={cancelEdit} style={{ padding: '12px 25px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* BOTTOM SECTION: Existing Questions List */}
          <div className="questions-list-section">
            <h2>Existing Questions ({questions.length})</h2>

            {questions.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-clipboard-list" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '15px' }}></i>
                <h3>No Questions Added Yet</h3>
                <p>Use the form above to add your first question.</p>
              </div>
            ) : (
              questions.map((item, index) => (
                <div key={item._id} className="question-card">
                  <div className="question-header">
                    <h3>{index + 1}. {item.question}</h3>
                    <span className="marks-badge">{item.marks} {item.marks === 1 ? 'Mark' : 'Marks'}</span>
                  </div>

                  <div className="options-list">
                    {/* Maps over options, checking if the current index is the correct answer */}
                    {item.options.map((opt, optIndex) => (
                      <div key={optIndex} className={`option-item ${Number(item.correctAnswer) === optIndex ? 'correct' : ''}`}>
                        <strong>{String.fromCharCode(65 + optIndex)}.</strong> {opt} 
                        {Number(item.correctAnswer) === optIndex && <i className="fas fa-check-circle" style={{ float: 'right', marginTop: '2px' }}></i>}
                      </div>
                    ))}
                  </div>

                  <div className="card-actions">
                    <button className="btn-edit-inline" onClick={() => startEdit(item)}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="btn-delete-inline" onClick={() => deleteQuestion(item._id)}>
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default ManageQuestions;