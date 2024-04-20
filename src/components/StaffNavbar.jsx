import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const StaffNavbar = () => {
  const { currentUser, signOut } = useAuth();
  console.log("Current user:", currentUser);
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/StaffSignIn");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link to="/adminLanding" className="navbar-brand text-white">
          Wonderland
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav ml-auto">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <p className="nav-link text-white">
                    Welcome, {currentUser.FirstName} {currentUser.LastName}
                  </p>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn text-white"
                    onClick={handleSignOut}
                    style={{ textDecoration: "underline", color: "blue" }}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <h2>Error</h2>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
