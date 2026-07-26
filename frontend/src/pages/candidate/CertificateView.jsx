import React from 'react';
import { Link } from 'react-router-dom';
import './css/CertificateView.css';

const CertificateView = () => {
    
    // Dummy data to visualize the layout
    const certificateData = {
        studentName: "John Doe",
        courseName: "Python Basics",
        issueDate: "August 24, 2026",
        certificateId: "CERT-9823-XYZ",
        score: "92%"
    };

    const handleDownload = () => {
        // We will add HTML-to-PDF logic here later!
        alert("Downloading Certificate as PDF...");
    };

    return (
        <div className="certificate-layout">
            
            {/* Action Bar (Buttons above the certificate) */}
            <div className="action-bar">
                <Link to="/candidate/dashboard" className="btn-back">
                    <i className="fas fa-arrow-left"></i> Back to Dashboard
                </Link>
                <button className="btn-download" onClick={handleDownload}>
                    <i className="fas fa-download"></i> Download PDF
                </button>
            </div>

            {/* The Certificate Document */}
            <div className="certificate-container" id="certificate-pdf">
                <div className="certificate-border">
                    <div className="certificate-inner-border">
                        
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png" 
                            alt="Logo" 
                            className="cert-logo" 
                        />
                        <h1 className="cert-header">Certificate of Completion</h1>
                        <p className="cert-subheader">Ujwal Radiant Vision Platform</p>
                        
                        <p className="cert-text">This is to certify that</p>
                        <div className="cert-name">{certificateData.studentName}</div>
                        
                        <p className="cert-text">has successfully completed the assessment for</p>
                        <div className="cert-course">{certificateData.courseName}</div>
                        
                        <p className="cert-text">Achieving a passing score of <strong>{certificateData.score}</strong>.</p>

                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/5668/5668045.png" 
                            alt="Gold Seal" 
                            className="cert-seal"
                        />

                        <div className="cert-footer">
                            <div className="cert-signature">
                                {/* Placeholder for an elegant signature font or image */}
                                <div style={{ fontFamily: 'cursive', fontSize: '1.5em', color: '#1e3a8a' }}>U. Radiant</div>
                                <div style={{ fontSize: '0.8em', color: '#64748b' }}>Platform Director</div>
                            </div>
                            
                            <div className="cert-meta">
                                <div><strong>Date Issued:</strong> {certificateData.issueDate}</div>
                                <div><strong>Credential ID:</strong> {certificateData.certificateId}</div>
                                <div><a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Verify at ujwalradiant.com/verify</a></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default CertificateView;