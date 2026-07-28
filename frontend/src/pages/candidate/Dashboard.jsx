import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      const res = await axios.get(
        "http://localhost:8081/candidate/dashboard",

        {
          withCredentials: true,
        },
      );

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
    <div className="dashboard-layout">
      <nav className="sidebar">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1162/1162846.png"
          alt="logo"
          className="sidebar-logo"
        />

        <div className="nav-item active">Home</div>

        <div className="spacer"></div>

        <button className="nav-item" onClick={logout}>
          Logout
        </button>
      </nav>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, {user.name}</h1>

          <p>{user.email}</p>

          <p>Role : {user.role}</p>
        </header>

        <div className="dashboard-grid">
          <div className="card">
            <h2>Profile</h2>

            <p>
              <b>Name :</b>

              {user.name}
            </p>

            <p>
              <b>Email :</b>

              {user.email}
            </p>

            <p>
              <b>Role :</b>

              {user.role}
            </p>

            <p>
              <b>Phone :</b>

              {user.phone_no || "Not Added"}
            </p>

            <p>
              <b>Verified :</b>

              {user.isVerified ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
