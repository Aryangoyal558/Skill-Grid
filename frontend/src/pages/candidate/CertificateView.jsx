import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './css/CertificateView.css';

const CertificateView = () => {
    const [searchParams] = useSearchParams();
    const attemptId = searchParams.get('attemptId');

    const [loading, setLoading] = useState(false);
    const [certificate, setCertificate] = useState(null);
    const [error, setError] = useState(null);

    const backendUrl = 'http://localhost:5000';

    useEffect(() => {
        if (!attemptId) {
            // Fallback display if no attempt ID passed in URL query
            return;
        }

        const fetchCertificate = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${backendUrl}/api/certificates/attempt/${attemptId}`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setCertificate(data);
                } else {
                    setError(data.message || 'Unable to generate or fetch certificate.');
                }
            } catch (err) {
                console.error('Error fetching certificate:', err);
                setError('Failed to connect to certificate server.');
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [attemptId]);

    const certData = certificate ? certificate.certificate : {
        studentName: "John Doe",
        assessmentTitle: "Full Stack Web Development",
        issueDate: new Date(),
        certificateNumber: "SG-CERT-DEMO-9823",
        scoreObtained: 92,
        totalMarks: 100,
        percentage: 92,
        grade: "S (Outstanding)",
        skillCategory: "Software Engineering"
    };

    const downloadUrl = certificate ? certificate.downloadUrl : `${backendUrl}/api/certificates/download/${certData.certificateNumber}`;
    const verifyUrl = certificate ? certificate.verifyUrl : `/verify/${certData.certificateNumber}`;

    return (
        <div className="certificate-layout">
            
            {/* Action Bar */}
            <div className="action-bar">
                <Link to="/candidate/dashboard" className="btn-back">
                    <i className="fas fa-arrow-left"></i> ← Back to Dashboard
                </Link>
                
                <a 
                    href={downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-download" 
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    📥 Download PDF Certificate
                </a>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', color: '#0284c7', margin: '40px 0' }}>
                    <p>Generating your digital certificate...</p>
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', color: '#ef4444', margin: '20px auto', maxWidth: '500px', background: '#fee2e2', padding: '16px', borderRadius: '8px' }}>
                    <p>{error}</p>
                </div>
            )}

            {/* The Certificate Document */}
            <div className="certificate-container" id="certificate-pdf">
                <div className="certificate-border">
                    <div className="certificate-inner-border">
                        
                        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎓</div>
                        <h1 className="cert-header">Certificate of Completion</h1>
                        <p className="cert-subheader">Ujwal Radiant Vision Platform</p>
                        
                        <p className="cert-text">This is to certify that</p>
                        <div className="cert-name">{certData.studentName}</div>
                        
                        <p className="cert-text">has successfully completed the skill assessment for</p>
                        <div className="cert-course">{certData.assessmentTitle}</div>
                        
                        <p className="cert-text">
                            Achieving a score of <strong>{certData.scoreObtained}/{certData.totalMarks} ({certData.percentage}%)</strong> with Grade <strong>{certData.grade}</strong>.
                        </p>

                        <div className="cert-footer" style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div className="cert-meta" style={{ textAlign: 'left' }}>
                                <div><strong>Date Issued:</strong> {new Date(certData.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                <div><strong>Certificate ID:</strong> <span style={{ fontFamily: 'monospace', color: '#0284c7' }}>{certData.certificateNumber}</span></div>
                                <div>
                                    <Link to={`/verify/${certData.certificateNumber}`} style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>
                                        🔗 Verify Online Authenticity
                                    </Link>
                                </div>
                            </div>

                            <div className="cert-signature" style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: 'cursive', fontSize: '1.4em', color: '#0f172a', fontWeight: 'bold' }}>Divyansh Verma</div>
                                <div style={{ fontSize: '0.85em', color: '#64748b' }}>Platform Director, Ujwal Radiant Vision</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default CertificateView;