import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    // Redirect to sign-in page.
    navigate("/signIn");
  };

  const handleBuyTickets = () => {
    if (!currentUser) {
      window.alert("You need to sign in to access the Buy Tickets page.");
    } else {
      navigate("/ticketPurchase");
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
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
              <a className="nav-link text-white" href="/">
                Home Page
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/parkInformation">
                Park Information
              </a>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn text-white"
                onClick={handleBuyTickets}
                style={{ cursor: "pointer" }}
              >
                Buy Tickets
              </button>
            </li>
            {currentUser ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link btn dropdown-toggle text-white"
                  onClick={toggleDropdown}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                  style={{ cursor: "pointer" }}
                >
                  Welcome, {currentUser.FirstName} {currentUser.LastName}
                </button>
                <div
                  className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                  aria-labelledby="navbarDropdown"
                >
                  <button className="dropdown-item">
                    Update Account Information
                  </button>
                  <button className="dropdown-item" onClick={handleSignOut}>
                    Logout
                  </button>
                  {/* Add more menu items here */}
                </div>
              </li>
            ) : (
              <li className="nav-item">
                <button className="btn btn-warning">
                  <Link
                    className="text-black"
                    to="/signIn"
                    style={{ textDecoration: "none " }}
                  >
                    Sign In
                  </Link>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
