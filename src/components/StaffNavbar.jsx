import React from "react";
import { useAuth } from "../context/AuthContext";

export const StaffNavbar = () => {
  const { currentUser, signOut } = useAuth();
  console.log("Current user:", currentUser);

  const handleSignOut = () => {
    signOut();
    // Redirect to sign-in page.
    window.location.href = "/StaffSignIn";
  };
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <a className="navbar-brand text-white" href="/">
          Wonderland
        </a>
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
            <li className="nav-item">
              <a className="nav-link text-white" href="/employeeLanding">
                Employee Portal
              </a>
            </li>

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
