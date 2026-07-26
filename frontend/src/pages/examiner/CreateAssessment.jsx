import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/CreateAssessment.css';

const CreateAssessment = () => {
    const [assessmentData, setAssessmentData] = useState({
        title: '',
        description: '',
        passingScore: 70,
        durationInMinutes: 30,
    });

    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
    ]);

    const handleBasicChange = (e) => {
        setAssessmentData({ ...assessmentData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[optIndex] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = { ...assessmentData, questions };
        console.log("Submitting new assessment to backend:", finalData);
        alert("Assessment created successfully!");
        // Here you will add your Axios POST request to save to MongoDB
    };

    return (
        <div className="create-assessment-layout">
            {/* Sidebar Navigation */}
            <nav className="sidebar">
                <img src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png" alt="Logo" className="sidebar-logo" />
                
                <Link to="/examiner/dashboard" className="nav-item" title="Dashboard">
                    <i className="fas fa-home"></i>
                </Link>
                <div className="nav-item active" title="Assessments">
                    <i className="fas fa-file-alt"></i>
                </div>
                <div className="spacer"></div>
                <Link to="/login" className="nav-item" title="Logout">
                    <i className="fas fa-sign-out-alt"></i>
                </Link>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                <div className="page-header">
                    <h1>Create New Assessment</h1>
                    <Link to="/examiner/dashboard">
                        <button className="btn-secondary">Cancel</button>
                    </Link>
                </div>

                <form className="form-container" onSubmit={handleSubmit}>
                    
                    {/* Basic Details Section */}
                    <div className="form-section">
                        <h3>1. Assessment Details</h3>
                        <div className="input-field" style={{ marginBottom: '15px' }}>
                            <label>Assessment Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                placeholder="e.g., Python Advanced Concepts" 
                                value={assessmentData.title}
                                onChange={handleBasicChange}
                                required
                            />
                        </div>
                        <div className="input-field" style={{ marginBottom: '15px' }}>
                            <label>Description</label>
                            <textarea 
                                name="description" 
                                rows="3" 
                                placeholder="Brief description of the skills being tested..."
                                value={assessmentData.description}
                                onChange={handleBasicChange}
                            ></textarea>
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label>Duration (Minutes)</label>
                                <input 
                                    type="number" 
                                    name="durationInMinutes" 
                                    min="10" 
                                    value={assessmentData.durationInMinutes}
                                    onChange={handleBasicChange}
                                    required
                                />
                            </div>
                            <div className="input-field">
                                <label>Passing Score (%)</label>
                                <input 
                                    type="number" 
                                    name="passingScore" 
                                    min="1" 
                                    max="100" 
                                    value={assessmentData.passingScore}
                                    onChange={handleBasicChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions Builder Section */}
                    <div className="form-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3>2. Question Bank</h3>
                            <button type="button" className="btn-secondary" onClick={addQuestion}>
                                <i className="fas fa-plus"></i> Add Question
                            </button>
                        </div>

                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="question-card">
                                <button type="button" className="remove-question-btn" onClick={() => removeQuestion(qIndex)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                                
                                <div className="input-field">
                                    <label>Question {qIndex + 1}</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter the question text here..." 
                                        value={q.questionText}
                                        onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="options-grid">
                                    {q.options.map((opt, optIndex) => (
                                        <div key={optIndex} className="option-input">
                                            <input 
                                                type="radio" 
                                                name={`correctAnswer-${qIndex}`} 
                                                checked={q.correctAnswerIndex === optIndex}
                                                onChange={() => handleQuestionChange(qIndex, 'correctAnswerIndex', optIndex)}
                                                title="Mark as correct answer"
                                            />
                                            <div className="input-field" style={{ flex: 1 }}>
                                                <input 
                                                    type="text" 
                                                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`} 
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ fontSize: '0.8em', color: '#666', marginTop: '10px' }}>
                                    <em>Select the radio button next to the correct answer.</em>
                                </p>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="btn-submit-assessment">Publish Assessment</button>
                </form>
            </main>
        </div>
    );
};

export default CreateAssessment;