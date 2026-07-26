import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/EmailVerification.css';

const EmailVerification = () => {
    const [code, setCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    // Mock email for display purposes - eventually you will pass this via state/context
    const userEmail = "student@example.com"; 

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log("Submitting verification code:", code);
        // Axios POST request to verify the code will go here
        
        // Simulating a successful verification
        setIsVerified(true);
    };

    const handleResend = () => {
        console.log("Resending verification code to:", userEmail);
        alert("A new code has been sent to your email.");
    };

    return (
        <div className="verification-page">
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
                        <div className="icon-wrapper">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/2664/2664679.png" 
                                alt="Email Icon" 
                                className="email-icon" 
                            />
                        </div>
                        
                        <h2>Verify Your Email</h2>
                        
                        {isVerified ? (
                            <div className="verification-success">
                                <div className="success-message">
                                    <strong>Success!</strong><br />
                                    Your email has been successfully verified. You can now access your dashboard.
                                </div>
                                <Link to="/login">
                                    <button className="action-btn">Go to Login</button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <p className="subtitle">
                                    We've sent a 6-digit verification code to <span>{userEmail}</span>. Please enter it below to confirm your account.
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div className="code-input-group">
                                        <input 
                                            type="text" 
                                            name="code" 
                                            placeholder="••••••" 
                                            maxLength="6"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Only allows numbers
                                            required 
                                        />
                                    </div>
                                    <button type="submit" className="action-btn">Verify Account</button>
                                </form>

                                <div className="resend-link">
                                    Didn't receive the code? 
                                    <button type="button" onClick={handleResend}>Resend</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;