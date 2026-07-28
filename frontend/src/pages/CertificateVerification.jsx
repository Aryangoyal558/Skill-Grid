import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './css/CertificateVerification.css';

const CertificateVerification = () => {
    const { certificateNumber: urlCertNumber } = useParams();
    const [certNumberInput, setCertNumberInput] = useState(urlCertNumber || '');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [searched, setSearched] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081';

    const verifyCertificate = async (idToVerify) => {
        const targetId = idToVerify || certNumberInput.trim();
        if (!targetId) return;

        setLoading(true);
        setSearched(true);
        setResult(null);

        try {
            const response = await fetch(`${backendUrl}/api/verify/${encodeURIComponent(targetId)}`);
            const data = await response.json();

            if (response.ok && data.isValid) {
                setResult({
                    status: 'success',
                    data: data
                });
            } else {
                setResult({
                    status: 'error',
                    message: data.message || 'Certificate not found. Please verify the Certificate ID and try again.'
                });
            }
        } catch (err) {
            console.error('Error verifying certificate:', err);
            setResult({
                status: 'error',
                message: 'Unable to reach verification server. Please check your network connection.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (urlCertNumber) {
            setCertNumberInput(urlCertNumber);
            verifyCertificate(urlCertNumber);
        }
    }, [urlCertNumber]);

    const handleSubmit = (e) => {
        e.preventDefault();
        verifyCertificate();
    };

    return (
        <div className="verify-page-container">
            <header className="verify-header">
                <div className="verify-brand">
                    <span className="brand-logo">🛡️</span>
                    <div>
                        <h1>Certification Registry</h1>
                        <p>Ujwal Radiant Vision Official Verification Portal</p>
                    </div>
                </div>
                <Link to="/login" className="btn-portal-link">Platform Login</Link>
            </header>

            <main className="verify-main-content">
                <div className="verify-card-box">
                    <div className="verify-hero">
                        <h2>Verify Digital Certificate</h2>
                        <p>Enter the unique Certificate ID or scan the QR Code printed on the certificate to check its authenticity.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="verify-search-form">
                        <div className="search-input-group">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text"
                                value={certNumberInput}
                                onChange={(e) => setCertNumberInput(e.target.value)}
                                placeholder="Enter Certificate ID (e.g. SG-CERT-XXXXXXXX)"
                                required
                            />
                            <button type="submit" className="btn-verify" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify Now'}
                            </button>
                        </div>
                    </form>

                    {searched && (
                        <div className="result-container">
                            {loading && (
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                    <p>Querying official database records...</p>
                                </div>
                            )}

                            {!loading && result && result.status === 'success' && (
                                <div className="cert-valid-card">
                                    <div className="status-badge valid">
                                        <span className="badge-icon">✓</span>
                                        <span>Official Authentic Credential</span>
                                    </div>

                                    <div className="cert-details-grid">
                                        <div className="detail-item full-width">
                                            <label>Candidate Name</label>
                                            <div className="val student-name">{result.data.studentName}</div>
                                        </div>

                                        <div className="detail-item full-width">
                                            <label>Course / Assessment Title</label>
                                            <div className="val course-title">{result.data.assessmentTitle}</div>
                                        </div>

                                        <div className="detail-item">
                                            <label>Skill Category</label>
                                            <div className="val">{result.data.skillCategory || 'General'}</div>
                                        </div>

                                        <div className="detail-item">
                                            <label>Grade Awarded</label>
                                            <div className="val grade-highlight">{result.data.grade}</div>
                                        </div>

                                        <div className="detail-item">
                                            <label>Percentage Achieved</label>
                                            <div className="val">{result.data.percentage}% ({result.data.scoreObtained}/{result.data.totalMarks} Marks)</div>
                                        </div>

                                        <div className="detail-item">
                                            <label>Issue Date</label>
                                            <div className="val">
                                                {new Date(result.data.issueDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        <div className="detail-item full-width">
                                            <label>Certificate ID</label>
                                            <div className="val cert-id-code">{result.data.certificateNumber}</div>
                                        </div>
                                    </div>

                                    <div className="cert-actions font-actions">
                                        <a 
                                            href={`${backendUrl}/api/certificates/download/${result.data.certificateNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-download-official"
                                        >
                                            📥 Download Official PDF
                                        </a>
                                    </div>
                                </div>
                            )}

                            {!loading && result && result.status === 'error' && (
                                <div className="cert-invalid-card">
                                    <div className="status-badge invalid">
                                        <span className="badge-icon">✕</span>
                                        <span>Invalid Credential</span>
                                    </div>
                                    <p className="error-message">{result.message}</p>
                                    <p className="error-tip">Please ensure you typed the full Certificate ID accurately (case-sensitive) or contact the issuing authority.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <footer className="verify-footer">
                <p>© 2026 Ujwal Radiant Vision. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CertificateVerification;
