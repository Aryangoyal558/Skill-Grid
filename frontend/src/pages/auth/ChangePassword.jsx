import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/ChangePassword.css';

const ChangePassword = () => {
    // State to hold the passwords
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    
    // State for toggling visibility
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // State for UI feedback
    const [error, setError] = useState('');
    const [isChanged, setIsChanged] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing again
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation: Check if passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match. Please try again.");
            return;
        }

        // Validation: Check minimum length (e.g., 8 characters)
        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        console.log("Submitting new password to backend...");
        // Axios request to your friend's backend will go here
        
        // Show success UI
        setIsChanged(true);
    };

    return (
        <div className="change-password-page">
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
                                src="https://cdn-icons-png.flaticon.com/512/6146/6146586.png" 
                                alt="Security Lock Icon" 
                                className="lock-icon" 
                            />
                        </div>
                        
                        <h2>Change Password</h2>
                        
                        {isChanged ? (
                            <div className="password-success">
                                <div className="success-message">
                                    <strong>Password Updated!</strong><br />
                                    Your password has been changed successfully. You can now log in with your new password.
                                </div>
                                <Link to="/login">
                                    <button className="action-btn">Back to Login</button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <p className="subtitle">
                                    Please enter your new password below. Make sure it is strong and secure.
                                </p>

                                <form onSubmit={handleSubmit}>
                                    {/* New Password Field */}
                                    <div className="input-group">
                                        <input 
                                            type={showNewPassword ? "text" : "password"} 
                                            name="newPassword" 
                                            placeholder="Enter new password" 
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            required 
                                        />
                                        <button 
                                            type="button" 
                                            className="password-toggle" 
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="input-group" style={{ marginBottom: '10px' }}>
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"} 
                                            name="confirmPassword" 
                                            placeholder="Confirm new password" 
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

                                    {/* Error Message Display */}
                                    {error && <div className="error-text">{error}</div>}

                                    <button type="submit" className="action-btn" style={{ marginTop: '10px' }}>
                                        Change Password
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;