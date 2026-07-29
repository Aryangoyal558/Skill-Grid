import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./css/Dashboard.css";
import axios from "axios";

const CertificateView = () => {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  // Dummy data to visualize the layout
  useEffect(() => {
    fetchCandidateDashboardData();
  }, []);

  const fetchCandidateDashboardData = async () => {
    try {
      // Fetch user profile first

      // Fetch optional dashboard lists safely
      const [certsRes] = await Promise.allSettled([
        axios.get("http://localhost:8081/certificate/my", {
          withCredentials: true,
        }),
      ]);

      if (certsRes.status === "fulfilled") {
        setCertificates(certsRes.value.data.certificates || []);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading Dashboard...
      </h2>
    );
  }

  return (
    <div className="container mt-4 mb-6">
      <div className="row">
        <div className="col-md-12">
          <div className="dashboard-card">
            <h2 className="text-xl font-bold mb-3">Earned Certificates</h2>
            {certificates.length === 0 ? (
              <p className="text-slate-500 italic">
                No certificates earned yet. Complete and pass an assessment to
                issue your digital certificate.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert._id}
                    className="p-4 border rounded-lg bg-slate-50 flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-slate-800">
                        {cert.assessmentTitle}
                      </strong>
                      <p className="text-xs text-slate-500">
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/candidate/verify-certificate/${cert.certificateCode}`}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View & Verify
                    </Link>
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
