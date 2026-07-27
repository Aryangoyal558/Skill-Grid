import React, { useState } from 'react';
import './css/LiveAssessment.css';

const mockQuestions = [
    {
        id: 1,
        text: "Which of the following defines a list in Python?",
        options: ["A) x = (1, 2, 3)", "B) x = [1, 2, 3]", "C) x = {1, 2, 3}", "D) x = <1, 2, 3>"]
    },
    {
        id: 2,
        text: "What is the correct file extension for Python files?",
        options: ["A) .pt", "B) .pyt", "C) .py", "D) .pyth"]
    },
    {
        id: 3,
        text: "How do you insert comments in Python code?",
        options: ["A) // This is a comment", "B) /* This is a comment */", "C) # This is a comment", "D) <!-- This is a comment -->"]
    }
];

const LiveAssessment = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // Store answers as { questionIndex: selectedOptionIndex }
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState({});

    const currentQuestion = mockQuestions[currentQuestionIndex];
    const totalQuestions = 25; // Hardcoded for UI demonstration based on the image

    const handleOptionSelect = (optionIndex) => {
        setAnswers({ ...answers, [currentQuestionIndex]: optionIndex });
    };

    const toggleFlag = () => {
        setFlagged({ ...flagged, [currentQuestionIndex]: !flagged[currentQuestionIndex] });
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < mockQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Helper for grid item styling
    const getGridItemClass = (index) => {
        if (index === currentQuestionIndex) return 'current';
        if (flagged[index]) return 'flagged';
        if (answers[index] !== undefined) return 'completed';
        return 'remaining';
    };

    return (
        <div className="assessment-layout">
            <div className="assessment-container">
                
                {/* Collapsed Sidebar */}
                <div className="assessment-sidebar">
                    <img src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png" alt="Avatar" className="sidebar-avatar" />
                    <i className="fas fa-home nav-icon"></i>
                    <i className="fas fa-users nav-icon"></i>
                    <i className="fas fa-file-alt nav-icon active"></i>
                    <i className="fas fa-question-circle nav-icon"></i>
                </div>

                {/* Main Assessment Area */}
                <div className="assessment-main">
                    <div className="assessment-header">
                        <h2>Live Assessment - Python Basics</h2>
                        <button className="btn-submit">Submit Assessment</button>
                    </div>

                    <div className="question-area">
                        <div className="question-number">Question {currentQuestionIndex + 1} of {totalQuestions}:</div>
                        <div className="question-text">{currentQuestion.text}</div>

                        <div className="options-list">
                            {currentQuestion.options.map((option, index) => (
                                <label 
                                    key={index} 
                                    className={`option-item ${answers[currentQuestionIndex] === index ? 'selected' : ''}`}
                                >
                                    <input 
                                        type="radio" 
                                        name={`question-${currentQuestionIndex}`}
                                        checked={answers[currentQuestionIndex] === index}
                                        onChange={() => handleOptionSelect(index)}
                                    />
                                    <span className="option-text">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="action-buttons">
                        <div className="btn-group-left">
                            <button className="btn-outline" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
                                Previous Question
                            </button>
                            <button className="btn-flag" onClick={toggleFlag}>
                                <i className="far fa-flag"></i> {flagged[currentQuestionIndex] ? 'Unflag' : 'Flag for Review'}
                            </button>
                        </div>
                        <div className="btn-group-right">
                            <button className="btn-outline" onClick={nextQuestion}>Skip</button>
                            <button className="btn-primary" onClick={nextQuestion} disabled={currentQuestionIndex === mockQuestions.length - 1}>
                                Next Question
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="assessment-right-panel">
                    
                    {/* Timer Panel */}
                    <div className="panel-card timer-display">
                        <h3 className="panel-title">Time Left Panel</h3>
                        <div className="timer-circle">00:28:45</div>
                        <div className="timer-text">Time Remaining: 00:28:45</div>
                    </div>

                    {/* Question Overview Grid */}
                    <div className="panel-card">
                        <h3 className="panel-title">Question Overview</h3>
                        <div className="question-grid">
                            {/* Render grid for total questions. Mapped to mock logic for available indices */}
                            {Array.from({ length: totalQuestions }).map((_, index) => (
                                <div 
                                    key={index} 
                                    className={`grid-item ${getGridItemClass(index)}`}
                                    onClick={() => index < mockQuestions.length && setCurrentQuestionIndex(index)}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                        <div className="legend">
                            <div className="legend-item"><div className="legend-color" style={{backgroundColor: '#10b981'}}></div> Completed</div>
                            <div className="legend-item"><div className="legend-color" style={{backgroundColor: '#facc15'}}></div> Flagged</div>
                            <div className="legend-item"><div className="legend-color" style={{backgroundColor: '#e2e8f0'}}></div> Remaining</div>
                            <div className="legend-item"><div className="legend-color" style={{backgroundColor: '#2563eb'}}></div> Current</div>
                        </div>
                    </div>

                    {/* Student Details */}
                    <div className="panel-card student-details">
                        <div className="student-info">
                            <h3 className="panel-title" style={{marginBottom: '5px'}}>Student Details</h3>
                            <p className="student-name">Welcome, John Doe!</p>
                            <p className="student-id">ID: 1121057024</p>
                        </div>
                        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Student" style={{width: '40px'}} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LiveAssessment;