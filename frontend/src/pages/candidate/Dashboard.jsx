import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:8081/candidate/dashboard", {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8081/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.log(err);
    }

    navigate("/login");
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <>
        <header className="dashboard-header">
          <h1>Welcome, {user.name}</h1>
          <p>{user.email}</p>
          <p>Role : {user.role}</p>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-md-3 pb-2">
              <div className="stat-card" style={{ backgroundColor: "#e0f2fe" }}>
                <h3>Account Status</h3>
                <h2>{user.isVerified ? "Verified" : "Pending"}</h2>

                <i
                  className="fas fa-user-check stat-icon"
                  style={{ color: "#0284c7" }}
                ></i>
              </div>
            </div>
            <div className="col-md-3 pb-2">
              <div className="stat-card" style={{ backgroundColor: "#dcfce7" }}>
                <h3>Email</h3>
                <h2>Active</h2>

                <i
                  className="fas fa-envelope stat-icon"
                  style={{ color: "#166534" }}
                ></i>
              </div>
            </div>

            <div className="col-md-3 pb-2">
              <div className="stat-card" style={{ backgroundColor: "#fef9c3" }}>
                <h3>Phone</h3>
                <h2>{user.phone_no ? "Added" : "Pending"}</h2>

                <i
                  className="fas fa-phone stat-icon"
                  style={{ color: "#a16207" }}
                ></i>
              </div>
            </div>

            <div className="col-md-3 pb-2">
              <div className="stat-card" style={{ backgroundColor: "#ffedd5" }}>
                <h3>Role</h3>
                <h2>{user.role}</h2>

                <i
                  className="fas fa-user-tag stat-icon"
                  style={{ color: "#c2410c" }}
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-6 pb-2">
              <div className="dashboard-card">
                <div className="card-header">
                  <h2>Profile Information</h2>
                </div>

                <p>
                  <b>Name :</b> {user.name}
                </p>
                <p>
                  <b>Email :</b> {user.email}
                </p>
                <p>
                  <b>Role :</b> {user.role}
                </p>
                <p>
                  <b>Phone :</b> {user.phone_no || "Not Added"}
                </p>
                <p>
                  <b>Verified :</b> {user.isVerified ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div className="col-md-6 pb-2">
              <div className="dashboard-card">
                <h2>Skill Assessment</h2>

                <p>Take assessments, improve skills and earn certificates.</p>

                <div className="list-item">
                  <div className="list-item-left">
                    <i className="fas fa-code"></i>

                    <div>
                      <strong>Available Assessments</strong>
                      <p>Explore skill tests and challenges.</p>
                    </div>
                  </div>
                </div>

                <div className="list-item">
                  <div className="list-item-left">
                    <i className="fas fa-award"></i>

                    <div>
                      <strong>Certificates</strong>
                      <p>View earned certificates.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-6 pb-2">
              <div className="dashboard-card">
                <h2>Learning Progress</h2>

                <p>Track your assessment performance.</p>

                <div className="progress">
                  <div className="progress-bar" style={{ width: "70%" }}></div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="dashboard-card">
                <h2>Account Details</h2>

                <p>
                  <b>Email :</b> {user.email}
                </p>
                <p>
                  <b>Role :</b> {user.role}
                </p>
                <p>
                  <b>Status :</b>{" "}
                  {user.isVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid"></div>
      </>
  );
};

export default Dashboard;
