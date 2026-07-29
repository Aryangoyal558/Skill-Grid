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

      setCertificates(response.data.certificates || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }

      console.log(err);
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
                {certificates.map((cert) => (
                  <div className="col-md-6" key={cert._id}>
                    <div className="certificate-card">
                      <div>
                        <h5>{cert.assessmentTitle}</h5>

                        <p>
                          Issued:{" "}
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>

                      <Link
                        to={`/candidate/verify-certificate/${cert.certificateCode}`}
                        className="btn btn-primary btn-sm"
                      >
                        View & Verify
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
