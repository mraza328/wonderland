import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StaffSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleStaffSignIn = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:3000/api/staffsignin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Sign-in data:", data);

    if (response.status === 200) {
      navigate("/adminLanding");
      signIn({
        UserID: data.userID,
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email,
        AccountType: data.accountType,
        PhoneNumber: data.phoneNumber,
        Position: data.position,
        Department: data.depname,
      });
    } else {
      setErrorMessage(data.message || "Incorrect User ID or Password");
    }
  };

  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-md-4 mb-8">
          <div className="card">
            <div className="card-body">
              <h1 className="my-4 text-center" style={{ color: "#2F4858" }}>
                Staff Sign In
              </h1>
              <form onSubmit={handleStaffSignIn}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail"
                    aria-describedby="emailHelp"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3 pb-3">
                  <label htmlFor="exampleInputPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-3 text-center">
                  <button type="submit" className="btn btn-primary">
                    Sign In
                  </button>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
