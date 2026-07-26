import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Register.css'; // Updated path based on your folder structure

const Register = () => {
    // 1. State for handling the selected role
    const [role, setRole] = useState('candidate');

    // 2. State for handling form inputs
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // 3. State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle input typing
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        console.log("Submitting Register for:", { role, ...formData });
        // Axios POST request will go here eventually
    };

    // Helper to format the role name for the title
    const getRoleDisplayName = () => {
        if (role === 'candidate') return 'Candidate';
        if (role === 'examiner') return 'Examiner';
        return 'Administrator';
    };

    return (
        <div className="register-page">
            <header className="platform-header">
                <div className="logo-container">
                    <div className="logo-text">
                        <span className="company-name">UJWAL RADIANT VISION</span>
                        <span className="platform-title">Online Skill Assessment and Digital Certification Platform</span>
                    </div>
                </div>
            </header>

            <div className="main-container">
                <div className="content-box">
                    <h2>Welcome to Ujwal Radiant Vision</h2>
                    <p className="subtitle">Choose your role to access your personalized dashboard.</p>

                    <div className="role-cards">
                        {/* Candidate Card */}
                        <div 
                            className={`role-card ${role === 'candidate' ? 'selected' : ''}`} 
                            onClick={() => setRole('candidate')}
                        >
                            <h3>CANDIDATE (Student)</h3>
                            <p>Access assessments, track progress, and view certificates.</p>
                        </div>

                        {/* Examiner Card */}
                        <div 
                            className={`role-card ${role === 'examiner' ? 'selected' : ''}`} 
                            onClick={() => setRole('examiner')}
                        >
                            <h3>EXAMINER</h3>
                            <p>Create and manage assessments, grade submissions.</p>
                        </div>

                        {/* Admin Card */}
                        <div 
                            className={`role-card ${role === 'admin' ? 'selected' : ''}`} 
                            onClick={() => setRole('admin')}
                        >
                            <h3>ADMINISTRATOR</h3>
                            <p>Manage platform settings, users, and overall operations.</p>
                        </div>
                    </div>

                    <div className="form-box">
                        <div className="form-title">
                            Sign Up as <span>{getRoleDisplayName()}</span>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    name="fullname" 
                                    placeholder="Full Name" 
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

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

                            <div className="input-group">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    name="confirmPassword" 
                                    placeholder="Confirm Password" 
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required 
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            <p className="terms-text">By signing up, you agree to our Terms and Conditions.</p>
                            
                            <button type="submit" className="action-btn signup-btn">SIGN UP</button>
                            
                            <div className="register-link">
                                Already have an account? <Link to="/login">Login here.</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;