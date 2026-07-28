import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getProfile();
  }, []);


  const getProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/candidate/dashboard",
        {
          withCredentials: true,
        }
      );

      setUser(res.data.user);

    } catch (err) {
      console.log(err);
      navigate("/login");

    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Loading Profile...
      </h2>
    );
  }


  return (
    <div className="container">

      <header className="dashboard-header">
        <h1>
          My Profile
        </h1>

        <p>
          Manage your account information
        </p>
      </header>



      <div className="row">

        {/* Profile Card */}

        <div className="col-md-4 pb-3">

          <div className="dashboard-card text-center">

            <i 
              className="fas fa-user-circle"
              style={{
                fontSize:"90px",
                color:"#2563eb"
              }}
            ></i>


            <h2 className="mt-3">
              {user.name}
            </h2>


            <p>
              {user.role}
            </p>


            <span
              className="badge bg-success"
            >
              {user.isVerified 
                ? "Verified Account"
                : "Pending Verification"
              }
            </span>


          </div>

        </div>



        {/* Details */}

        <div className="col-md-8 pb-3">

          <div className="dashboard-card">


            <h2>
              Personal Information
            </h2>


            <hr/>


            <p>
              <b>Name :</b> {user.name}
            </p>


            <p>
              <b>Email :</b> {user.email}
            </p>


            <p>
              <b>Phone :</b> 
              {" "}
              {user.phone_no || "Not Added"}
            </p>


            <p>
              <b>Role :</b> {user.role}
            </p>


            <p>
              <b>Email Status :</b>
              {" "}
              {user.isVerified
                ? "Verified"
                : "Not Verified"
              }
            </p>


          </div>


        </div>


      </div>




      {/* Account Summary */}

      <div className="row mt-3">


        <div className="col-md-4 pb-3">

          <div 
            className="stat-card"
            style={{
              background:"#e0f2fe"
            }}
          >

            <h3>
              Account
            </h3>

            <h2>
              Active
            </h2>

            <i className="fas fa-user-check stat-icon"></i>

          </div>

        </div>



        <div className="col-md-4 pb-3">


          <div 
            className="stat-card"
            style={{
              background:"#dcfce7"
            }}
          >

            <h3>
              Email
            </h3>

            <h2>
              Verified
            </h2>

            <i className="fas fa-envelope stat-icon"></i>

          </div>


        </div>




        <div className="col-md-4 pb-3">


          <div 
            className="stat-card"
            style={{
              background:"#fef9c3"
            }}
          >

            <h3>
              Phone
            </h3>

            <h2>
              {
                user.phone_no
                ? "Added"
                : "Pending"
              }
            </h2>

            <i className="fas fa-phone stat-icon"></i>


          </div>


        </div>


      </div>


    </div>
  );
};


export default Profile;