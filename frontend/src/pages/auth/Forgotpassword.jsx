import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // This is where you will send the email to your backend to trigger the reset logic
        console.log("Requesting password reset for:", email);
        
        // Show success message to the user
        setIsSubmitted(true);
    };

    return (
        <div className="forgot-password-page">
            <div className="app-container">
                {/* Header */}
                <header className="platform-header">
                    <div className="logo-container">
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
                    <div className="form-box">
                        <h2>Forgot Password?</h2>
                        <p className="subtitle">
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </p>

                        {isSubmitted ? (
                            <div className="success-message">
                                <strong>Check your inbox!</strong><br />
                                If an account exists for {email}, a reset link has been sent.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Enter your email address" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                                <button type="submit" className="action-btn">Send Reset Link</button>
                            </form>
                        )}

                        <Link to="/login" className="back-link">
                            &larr; Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;