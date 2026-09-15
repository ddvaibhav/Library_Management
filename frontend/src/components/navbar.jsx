import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Server_URL } from "../utils/config";
import "./navbar.css";

export default function Navbar(){

    const [menuOpen, setMenuOpen] = useState(false);
    const [liveStudent, setLiveStudent] = useState(false);
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    useEffect(() => {
      if (!token) {
        setLiveStudent(false);
        return;
      }

      const fetchLibraryStatus = async () => {
        try {
          const response = await axios.get(`${Server_URL}users/library-status`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLiveStudent(response.data?.status === "In Library");
        } catch (error) {
          setLiveStudent(false);
        }
      };

      fetchLibraryStatus();
    }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/login");
  };


    return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
    <div className="container">
      
      <Link className="navbar-brand brand-with-logo fw-bold" to="/">
        <img
          src="https://campus.newartscollege.ac.in/Content/img/logo.png"
          alt="College Logo"
          className="college-logo"
        />
        <span className="brand-text">
          <span className="brand-line brand-line-small">Ahmednagar Jilha Maratha Vidya Prasarak Samaj’s Ahmednagar</span>
          <span className="brand-line brand-line-large">NEW ARTS, COMMERCE &amp; SCIENCE COLLEGE, AHMEDNAGAR</span>
          <span className="brand-line brand-line-sub">(AUTONOMOUS)</span>
        </span>
      </Link>

      
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

 
      <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/books">Books</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/category">Category</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/aboutus">About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contactus">Contact</Link>
          </li>
        </ul>

    
        <ul className="navbar-nav">
          {token ? (
            <>
              {liveStudent && (
                <li className="nav-item live-indicator-item">
                  <span className="live-indicator">
                    <span className="live-dot"></span>
                    Live Student
                  </span>
                </li>
              )}

              <li className="nav-item dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  👤 Profile
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/user">My Profile</Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="btn btn-light me-2" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-outline-light" to="/register">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  </nav>
    )
}