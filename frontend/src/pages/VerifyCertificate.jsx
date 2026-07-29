import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function VerifyCertificate() {
  const { certificateCode } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    verifyCertificate();
  }, []);

  const verifyCertificate = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/certificate/verify/${certificateCode}`,
      );

      setCertificate(res.data.certificate);
    } catch (err) {
      setError(err.response?.data?.message || "Certificate not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Verifying Certificate...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="card shadow text-center p-5">
          <h2 className="text-danger">❌ Invalid Certificate</h2>

          <p>{error}</p>

          <Link to="/" className="btn btn-primary mt-3">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-success text-white text-center py-4">
          <h2>🏆 Digital Certificate Verification</h2>
        </div>

        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h3 className="text-success">
              ✅ Certificate Verified Successfully
            </h3>
          </div>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <th width="30%">Certificate Code</th>
                <td>{certificate.certificateCode}</td>
              </tr>

              <tr>
                <th>Candidate</th>
                <td>{certificate.candidate.name}</td>
              </tr>

              <tr>
                <th>Email</th>
                <td>{certificate.candidate.email}</td>
              </tr>

              <tr>
                <th>Assessment</th>
                <td>{certificate.assessment.title}</td>
              </tr>

              <tr>
                <th>Score</th>
                <td>
                  {certificate.result.score} / {certificate.result.totalMarks}
                </td>
              </tr>

              <tr>
                <th>Percentage</th>
                <td>{certificate.result.percentage}%</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>
                  <span className="badge bg-success">
                    {certificate.result.status}
                  </span>
                </td>
              </tr>

              <tr>
                <th>Issued On</th>
                <td>{new Date(certificate.issueDate).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-center mt-4">
            <button
              className="btn btn-primary me-3"
              onClick={() => window.print()}
            >
              🖨 Print Certificate
            </button>

            <Link to="/" className="btn btn-secondary">
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyCertificate;
