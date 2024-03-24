import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AddEmployee({ employeeData = {}, onSuccess }) {
  console.log("Received employeeData:", employeeData);
  const {
    userId: initialUserID = "",
    firstName = "",
    middleName = "",
    lastName = "",
    phoneNumber = "",
    email = "",
  } = employeeData;

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [userIDState, setUserIDState] = useState(initialUserID);
  const [firstNameState, setFirstName] = useState(firstName);
  const [middleNameState, setMiddleName] = useState(middleName);
  const [lastNameState, setLastName] = useState(lastName);
  const [phoneNumberState, setPhoneNumber] = useState(phoneNumber);
  const [emailState, setEmail] = useState(email);
  const [positionState, setPosition] = useState("");
  const [supervisorUserIdState, setSupervisorUserId] = useState("");
  const [salaryState, setSalary] = useState("");
  const [departmentState, setDepartment] = useState("");

  const [addressState, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employee = {
      userId: userIDState,
      firstName: firstNameState,
      middleName: middleNameState,
      lastName: lastNameState,
      phoneNumber: phoneNumberState,
      email: emailState,
      position: positionState,
      supUserId: supervisorUserIdState,
      salary: salaryState,
      address: addressState,
      department: departmentState,
    };

    try {
      const response = await fetch("http://localhost:3000/api/addemployee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Employee added successfully:", responseData);

        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("Failed to add employee.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <div className="row justify-content-center">
      <div className="col md-4 mb-4">
        <div className="card dataEntryForm">
          <div className="card-body">
            <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
              Add Employee
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="userID" className="form-label">
                    User ID:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="userID"
                    name="userID"
                    placeholder="User ID"
                    required
                    value={userIDState}
                    onChange={(e) => setUserIDState(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3 mt-3">
                <div className="col">
                  <label htmlFor="firstName" className="form-label">
                    First Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    maxLength="30"
                    required
                    value={firstNameState}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="middleName" className="form-label">
                    Middle Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="middleName"
                    name="middleName"
                    placeholder="Bro"
                    maxLength="30"
                    value={middleName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="lastName" className="form-label">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    maxLength="30"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="(111)-111-1111"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="johndoe@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="position" className="form-label">
                    Position:
                  </label>
                  <select
                    className="form-select"
                    aria-label="Select Position"
                    required
                    value={positionState}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option selected value={""}>
                      Select Position
                    </option>
                    <option value="Admin">Admin</option>
                    <option value="Park Manager">Park Manager</option>
                    <option value="Department Manager">
                      Department Manager
                    </option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="supUserID" className="form-label">
                    Supervisor ID:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="supUserID"
                    name="supUserID"
                    placeholder="12345"
                    value={supervisorUserIdState}
                    onChange={(e) => setSupervisorUserId(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="salary" className="form-label">
                    Salary:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="salary"
                    name="salary"
                    placeholder="65000"
                    required
                    value={salaryState}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="department" className="form-label">
                    Department:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    name="department"
                    placeholder="e.g., Human Resources"
                    required
                    value={departmentState}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="mb-2">Address</div>
                <div className="col">
                  <label htmlFor="street" className="form-label">
                    Street:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    name="street"
                    placeholder="1111 FrostRiver Ln"
                    required
                    value={addressState.street}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="city" className="form-label">
                    City:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    placeholder="City"
                    required
                    value={addressState.city}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="state" className="form-label">
                    State:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    placeholder="State"
                    required
                    value={addressState.state}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="zipcode" className="form-label">
                    Zipcode:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="zipcode"
                    name="zipcode"
                    placeholder="Zipcode"
                    required
                    value={addressState.zipcode}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button type="submit" className="btn btn-primary">
                    Add Employee
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
