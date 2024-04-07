import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { currentConfig } from "../config";
import { useAuth } from "../context/AuthContext";

export default function UpdateAccount() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const baseURL = currentConfig.REACT_APP_API_BASE_URL;
  console.log(currentUser);

  const [formData, setFormData] = useState({
    firstName: currentUser?.FirstName || "",
    middleName: currentUser?.MiddleName || "",
    lastName: currentUser?.LastName || "",
    email: currentUser?.Email || "",
    dateOfBirth: currentUser?.DateOfBirth.split("T")[0] || "",
    phoneNumber: currentUser?.PhoneNumber || "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // This effect runs once on component mount, and logs the current user
    console.log(currentUser);
  }, [currentUser]);

  // Update local state when form fields change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${baseURL}/updatecustomeraccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        setErrorMessage("Update unsuccessful, try again later");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Update unsuccessful, try again later");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col md-4 mb-4">
        <div className="card sign-up">
          <div className="card-body">
            <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
              Update Account Information
            </h1>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row mt-5 mb-3">
                <div className="col">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-auto">
                  <label htmlFor="middleName" className="form-label">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-5 text-center">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
