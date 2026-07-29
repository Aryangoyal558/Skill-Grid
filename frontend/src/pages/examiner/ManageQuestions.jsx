import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css"; 
import "./css/ManageQuestions.css";

const ManageQuestions = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // We need the skillId to fetch the right bank questions. 
  // It is passed when navigating here from the assessment list.
  const skillId = location.state?.skillId || null;

  // UI State for Tabs
  const [activeTab, setActiveTab] = useState("current"); // 'current', 'bank', 'new'

  // Data States
  const [questions, setQuestions] = useState([]); // Questions inside this test
  const [bankQuestions, setBankQuestions] = useState([]); // Questions in the global bank

  // Form States
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [marks, setMarks] = useState(1);
  const [difficulty, setDifficulty] = useState("Medium");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssessmentQuestions();
    if (skillId) {
      loadBankQuestions();
    }
  }, [skillId]);

  // 1. Fetch questions currently in THIS assessment
  const loadAssessmentQuestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/question/manage/${assessmentId}`,
        { withCredentials: true }
      );
      setQuestions(res.data.questions);
    } catch (err) {
      console.log(err);
    }
  };

  // 2. Fetch questions from the global Question Bank (DEDUPLICATED)
  const loadBankQuestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/question/bank/${skillId}`,
        { withCredentials: true }
      );
      
      // Deduplicate the questions!
      // This filters them so the Bank tab only shows ONE unique copy of each question based on the text.
      const uniqueQuestions = Array.from(
        new Map(res.data.questions.map(item => [item.question, item])).values()
      );

      setBankQuestions(uniqueQuestions);
    } catch (err) {
      console.log("Could not load bank questions", err);
    }
  };

  const handleOptionChange = (index, value) => {
    const temp = [...options];
    temp[index] = value;
    setOptions(temp);
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setQuestionText(item.question);
    setOptions(item.options);
    setCorrectAnswer(item.correctAnswer.toString());
    setMarks(item.marks);
    setDifficulty(item.difficulty || "Medium");
    setActiveTab("new"); // Switch to the form tab
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
    setActiveTab("current");
  };

  const resetForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setMarks(1);
    setDifficulty("Medium");
  };

  // 3. Add or Update a custom question from the form
  const addQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        assessment: assessmentId,
        skillId: skillId, // Links it to the category
        question: questionText,
        options,
        correctAnswer: Number(correctAnswer),
        marks,
        difficulty
      };

      if (editingId) {
        await axios.put(`http://localhost:8081/question/${editingId}`, payload, { withCredentials: true });
        alert("Question Updated Successfully!");
      } else {
        await axios.post("http://localhost:8081/question", payload, { withCredentials: true });
        alert("Question Added Successfully!");
      }

      resetForm();
      setEditingId(null);
      setActiveTab("current"); // Send them back to the list
      loadAssessmentQuestions();
      if (skillId) loadBankQuestions(); // Refresh bank in case it was a new question
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Add a question directly from the Question Bank
  const addFromBank = async (bankItem) => {
    try {
      // We "clone" the bank question and attach it to this specific assessment
      await axios.post("http://localhost:8081/question", {
        assessment: assessmentId,
        skillId: bankItem.skillId,
        question: bankItem.question,
        options: bankItem.options,
        correctAnswer: bankItem.correctAnswer,
        marks: bankItem.marks,
        difficulty: bankItem.difficulty
      }, { withCredentials: true });
      
      alert("Question added from Bank!");
      loadAssessmentQuestions();
      setActiveTab("current"); // Switch view to show the newly added question
    } catch (err) {
      alert("Failed to add question from bank.");
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`http://localhost:8081/question/${id}`, { withCredentials: true });
      loadAssessmentQuestions();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-logo" style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>URV</div>
        <button className="nav-item" onClick={() => navigate("/examiner/dashboard")} title="Dashboard"><i className="fas fa-home"></i></button>
        <button className="nav-item" onClick={() => navigate("/examiner/create-assessment")} title="Create Assessment"><i className="fas fa-plus-circle"></i></button>
        <button className="nav-item active" onClick={() => navigate("/examiner/assessments")} title="My Assessments"><i className="fas fa-list-ul"></i></button>
        <div className="spacer"></div>
      </nav>

      <main className="dashboard-main">
        <div className="header-actions">
          <div className="dashboard-header" style={{ marginBottom: 0 }}>
            <h1>Manage Questions</h1>
            <p>Build your assessment by adding new questions or pulling from the bank.</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate("/examiner/assessments")} style={{ padding: "10px 20px", borderRadius: "8px", background: "white", border: "1px solid #cbd5e1", cursor: "pointer" }}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
        </div>

        {/* --- TABS NAVIGATION --- */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
          <button 
            onClick={() => setActiveTab("current")}
            style={{ padding: '10px 20px', background: activeTab === 'current' ? '#2563eb' : 'transparent', color: activeTab === 'current' ? 'white' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Current Assessment ({questions.length})
          </button>
          <button 
            onClick={() => setActiveTab("bank")}
            style={{ padding: '10px 20px', background: activeTab === 'bank' ? '#2563eb' : 'transparent', color: activeTab === 'bank' ? 'white' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <i className="fas fa-database"></i> Question Bank
          </button>
          <button 
            onClick={() => setActiveTab("new")}
            style={{ padding: '10px 20px', background: activeTab === 'new' ? '#10b981' : 'transparent', color: activeTab === 'new' ? 'white' : '#10b981', border: '1px solid #10b981', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Create New Question
          </button>
        </div>

        <div className="manage-container">
          
          {/* TAB 1: CURRENT ASSESSMENT QUESTIONS */}
          {activeTab === "current" && (
            <div className="questions-list-section">
              {questions.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                  <i className="fas fa-clipboard-list" style={{ fontSize: "3rem", color: "#cbd5e1", marginBottom: "15px" }}></i>
                  <h3>No Questions Added Yet</h3>
                  <p>Use the tabs above to create a question or pull one from the bank.</p>
                </div>
              ) : (
                questions.map((item, index) => (
                  <div key={item._id} className="question-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
                    <div className="question-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0 }}>{index + 1}. {item.question}</h3>
                      <span className="marks-badge" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {item.difficulty || "Medium"} | {item.marks} Marks
                      </span>
                    </div>

                    <div className="options-list" style={{ marginTop: '15px' }}>
                      {item.options.map((opt, optIndex) => (
                        <div key={optIndex} style={{ padding: '8px', background: Number(item.correctAnswer) === optIndex ? '#dcfce7' : '#f8fafc', marginBottom: '5px', borderRadius: '6px' }}>
                          <strong>{String.fromCharCode(65 + optIndex)}.</strong> {opt}
                        </div>
                      ))}
                    </div>

                    <div className="card-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                      <button onClick={() => startEdit(item)} style={{ padding: '6px 12px', background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteQuestion(item._id)} style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: QUESTION BANK */}
          {activeTab === "bank" && (
            <div className="questions-list-section">
              <h2 style={{ marginBottom: '15px' }}>Select from Bank</h2>
              {!skillId && <p style={{ color: '#dc2626' }}>Warning: No Subject Category linked to this assessment. Cannot filter bank.</p>}
              
              {bankQuestions.length === 0 ? (
                <p>No unique questions found in the bank for this category.</p>
              ) : (
                bankQuestions.map((item) => (
                  <div key={item._id} className="question-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px dashed #94a3b8' }}>
                    <div className="question-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0, color: '#334155' }}>{item.question}</h3>
                      <span className="marks-badge" style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>
                        {item.difficulty || "Medium"} | {item.marks} Marks
                      </span>
                    </div>
                    <button onClick={() => addFromBank(item)} style={{ marginTop: '15px', padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                      <i className="fas fa-plus"></i> Add to Assessment
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ADD/EDIT QUESTION FORM */}
          {activeTab === "new" && (
            <div className="question-form-card" style={{ border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px', background: 'white' }}>
              <h2 style={{ marginBottom: '20px' }}>{editingId ? "✏️ Edit Question" : "➕ Create New Question"}</h2>

              <form onSubmit={addQuestion}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Question Text</label>
                  <textarea className="form-control" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>

                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Options</label>
                <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                  {options.map((opt, i) => (
                    <input key={i} className="form-control" placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  ))}
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Correct Answer</label>
                    <select className="form-control" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="" disabled>Select correct option...</option>
                      <option value="0">Option A</option>
                      <option value="1">Option B</option>
                      <option value="2">Option C</option>
                      <option value="3">Option D</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Difficulty</label>
                    <select className="form-control" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Marks</label>
                    <input className="form-control" type="number" min="1" value={marks} onChange={(e) => setMarks(Number(e.target.value))} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "15px" }}>
                  <button type="submit" disabled={loading} style={{ padding: "12px 25px", borderRadius: "8px", border: "none", background: editingId ? "#f59e0b" : "#10b981", color: "white", fontWeight: "bold", cursor: "pointer", flex: 1 }}>
                    {loading ? "Saving..." : editingId ? "Update Question" : "Save to Assessment & Bank"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} style={{ padding: "12px 25px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white", fontWeight: "bold", cursor: "pointer" }}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ManageQuestions;