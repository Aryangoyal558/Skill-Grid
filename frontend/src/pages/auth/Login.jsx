import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Login.css';

const Login = () => {
    const [role, setRole] = useState('candidate');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Login for:", { role, ...formData });
    };

    const getRoleDisplayName = () => {
        if (role === 'candidate') return 'Candidate';
        if (role === 'examiner') return 'Examiner';
        return 'Administrator';
    };

    return (
        <div className="login-page">
            <div className="app-container">
                {/* Header */}
                <header className="platform-header">
                    <div className="logo-container">
                        {/* Placeholder URL for the logo */}
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png" 
                            alt="Ujwal Radiant Vision" 
                            className="platform-logo" 
                        />
                        <div className="logo-text">
                            <span className="company-name">UJWAL RADIANT VISION</span>
                            <span className="platform-title">Online Skill Assessment and Digital Certification Platform</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="main-container">
                    <div className="content-box">
                        <h2>Welcome to Ujwal Radiant Vision</h2>
                        <p className="subtitle">Choose your role to access your personalized dashboard.</p>

                        <div className="role-cards">
                            {/* Candidate Card */}
                            <div 
                                className={`role-card card-candidate ${role === 'candidate' ? 'selected' : ''}`} 
                                onClick={() => setRole('candidate')}
                            >
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                                    alt="Candidate" 
                                    className="role-icon" 
                                />
                                <h3>CANDIDATE (Student)</h3>
                                <p>Access assessments, track progress, and view certificates.</p>
                            </div>

                            {/* Examiner Card */}
                            <div 
                                className={`role-card card-examiner ${role === 'examiner' ? 'selected' : ''}`} 
                                onClick={() => setRole('examiner')}
                            >
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/1945/1945120.png" 
                                    alt="Examiner" 
                                    className="role-icon" 
                                />
                                <h3>EXAMINER</h3>
                                <p>Create and manage assessments, grade submissions.</p>
                            </div>

                            {/* Administrator Card */}
                            <div 
                                className={`role-card card-admin ${role === 'admin' ? 'selected' : ''}`} 
                                onClick={() => setRole('admin')}
                            >
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/1484/1484831.png" 
                                    alt="Administrator" 
                                    className="role-icon" 
                                />
                                <h3>ADMINISTRATOR</h3>
                                <p>Manage platform settings, users, and overall operations.</p>
                            </div>
                        </div>

                        {/* Login Form */}
                        <div className="form-box">
                            <div className="form-title">
                                Login as <span>{getRoleDisplayName()}</span>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Email address" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="input-group">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        placeholder="Password" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <div className="forgot-password">
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </div>
                                
                                <button type="submit" className="action-btn login-btn">SIGN IN</button>
                                
                                <div className="register-link">
                                    New User? <Link to="/register">Register here.</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;