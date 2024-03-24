import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { currentConfig } from "../config";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const baseURL = currentConfig.REACT_APP_API_BASE_URL;
  console.log(currentConfig.REACT_APP_API_BASE_URL);

  const handleSignIn = async (event) => {
    event.preventDefault();
    const response = await fetch(`${baseURL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    //console.log("Sign-in data:", data);

    if (response.status === 200) {
      navigate("/");
      signIn({
        UserID: data.userID,
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email,
        AccountType: data.accountType,
        PhoneNumber: data.phoneNumber,
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
            <div className="card-body" style={{ marginBottom: "5%" }}>
              <h1 className="my-4 text-center" style={{ color: "#2F4858" }}>
                Sign In
              </h1>
              <form onSubmit={handleSignIn}>
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

                <div className="text-center">
                  <div className="mt-5 pb-3">
                    <p>
                      New User?{" "}
                      <a href="/signUp" className="text-decoration-none">
                        Create an Account
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <footer
        className="footer py-3"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "#33658A",
          width: "100%",
          textAlign: "right",
        }}
      >
        <div className="container text-right">
          <span className="text-muted">
            <Link
              className="text-black"
              to="/staffSignIn"
              style={{ textDecoration: "none " }}
            >
              Staff Sign In
            </Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
