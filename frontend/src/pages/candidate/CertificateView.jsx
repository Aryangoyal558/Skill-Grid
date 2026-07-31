import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";

const CertificateView = () => {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidateDashboardData();
  }, []);

  const fetchCandidateDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/certificate/my", {
        withCredentials: true,
      });

      // Flexible handling whether backend returns array directly or wrapped in { certificates: [...] }
      const certList = Array.isArray(response.data) 
        ? response.data 
        : response.data.certificates || [];

      setCertificates(certList);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        Loading Certificates...
      </h2>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        <div className="col-md-12">
          <div className="dashboard-card">
            <h2 className="mb-4">Earned Certificates</h2>

            {certificates.length === 0 ? (
              <p className="text-secondary">
                No certificates earned yet. Complete and pass an assessment to
                issue your digital certificate.
              </p>
            ) : (
              <div className="row g-4">
                {certificates.map((cert) => {
                  // Fallback for assessment title depending on flat vs nested payload
                  const assessmentTitle =
                    cert.assessmentTitle ||
                    cert.assessment?.title ||
                    cert.assessment?.name ||
                    "Skill Assessment";

                  // Safe date formatting
                  const formattedDate = cert.issueDate
                    ? new Date(cert.issueDate).toLocaleDateString()
                    : "N/A";

                  // Extract code safely
                  const certCode = cert.certificateCode || cert.certificateNumber || cert._id;

                  return (
                    <div className="col-md-6" key={cert._id}>
                      <div className="certificate-card p-3 border rounded shadow-sm">
                        <div>
                          <h5 className="fw-bold">{assessmentTitle}</h5>
                          <p className="text-muted mb-2">
                            Issued: {formattedDate}
                          </p>
                          <p className="small text-secondary mb-3">
                            Code: <code>{certCode}</code>
                          </p>
                        </div>

                        <Link
                          to={`/candidate/verify-certificate/${certCode}`}
                          className="btn btn-primary btn-sm"
                        >
                          View & Verify
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;