import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";
import { useAuth } from "../context/AuthContext";

export default function UpdateEmployee() {
  const { currentUser } = useAuth();
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState([]);
  const [departments, setDepartments] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const positions = ["Employee", "Maintenance", "Department Manager", "Admin"];
  const schedules = ["First Shift", "Second Shift"];

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  const [combinedObject, setCombinedObject] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch(`${baseURL}/getalldepartments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log("Failed to fetch attraction data");
      }
      if (response.ok) {
        setDepartments(json);
        setIsSet(true);
      }
    };

    fetchDepartments();
  }, []);

  const fetchEmployeesByDepartment = async () => {
    const response = await fetch(`${baseURL}/getemployeesbydepartment`, {
      method: "POST",
      body: JSON.stringify({ department: employeeDepartment }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      console.log("Failed to fetch employee data");
    }
    if (response.ok) {
      setEmployees(json);
    }
  };

  useEffect(() => {
    if (employeeDepartment) {
      fetchEmployeesByDepartment();
    }
  }, [employeeDepartment]);

  const handleSubmitOne = async (e) => {
    e.preventDefault();
    setEmployeeData(null);
    setAccountData(null);
    setCombinedObject(null);
    setisSubmitted(false);
    setCreationSuccess(false);
    setNotFound(false);

    const formData = { employeeId };

    try {
      const response = await fetch(`${baseURL}/getemployee`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setNotFound(true);
        console.log("Failed to fetch employee data");
      }
      if (response.ok) {
        setEmployeeData(json[0]);
      }

      const res = await fetch(`${baseURL}/getaccount`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const js = await res.json();
      js[0].DateOfBirth = js[0].DateOfBirth.substring(0, 10);

      if (!response.ok) {
        console.log("Failed to fetch account data");
      }
      if (response.ok) {
        setAccountData(js[0]);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    if (employeeData !== null && accountData !== null) {
      setCombinedObject(Object.assign({}, employeeData, accountData));
      setisSubmitted(true);
    }
  }, [employeeData, accountData]);

  const handleSubmitTwo = async (e) => {
    e.preventDefault();
    setCreationSuccess(false);

    const formData = combinedObject;

    try {
      const response = await fetch(`${baseURL}/updateemployee`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setErrors(json.errors);
        setErrorFields(json.errorFields);
      }
      if (response.ok) {
        setErrors([]);
        setErrorFields([]);
        setCreationSuccess(true);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col md-4 mb-4">
        <div className="card dataEntryForm">
          <div className="card-body">
            <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
              Update Employee
            </h1>
            <div className="text-center">
              Please select the employee you want to update from the dropdown
              below.
            </div>

            {isSet && (
              <form onSubmit={handleSubmitOne}>
                <div className="mb-3 mt-3">
                  <label htmlFor="employeeDepartment" className="form-label">
                    Select Employee's Department:
                  </label>
                  <select
                    className="form-select"
                    id="employeeDepartment"
                    name="employeeDepartment"
                    value={employeeDepartment}
                    onChange={(e) => setEmployeeDepartment(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map((department, index) => (
                      <option key={index} value={department.DepName}>
                        {department.DepName}
                      </option>
                    ))}
                  </select>
                </div>
                {employeeDepartment && (
                  <div className="mb-3 mt-3">
                    <label htmlFor="employeeId" className="form-label">
                      Select Employee:
                    </label>
                    <select
                      className="form-select"
                      id="employeeId"
                      name="employeeId"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    >
                      <option value="">Select Employee</option>
                      {employees.filter((employee) => {
                        // Check if the current user is a department manager
                        const isDepartmentManager =
                          currentUser &&
                          currentUser.Position === "Department Manager";
                        // Filter out department managers if the current user is also a department manager
                        return !(
                          isDepartmentManager &&
                          employee.Position === "Department Manager"
                        );
                      }).length > 0 ? (
                        employees
                          .filter((employee) => {
                            // Check if the current user is a department manager
                            const isDepartmentManager =
                              currentUser &&
                              currentUser.Position === "Department Manager";
                            // Filter out department managers if the current user is also a department manager
                            return !(
                              isDepartmentManager &&
                              employee.Position === "Department Manager"
                            );
                          })
                          .map((employee) => (
                            <option
                              key={employee.UserID}
                              value={employee.UserID}
                            >
                              {`Employee ID: ${employee.UserID} | ${employee.FirstName} ${employee.LastName} (${employee.Position})`}
                            </option>
                          ))
                      ) : (
                        <option disabled>
                          No employees found in this department
                        </option>
                      )}
                    </select>
                  </div>
                )}
                <div className="flex flex-wrap -mx-3 mt-6">
                  <div className="w-full px-3 text-center">
                    <button
                      id="button"
                      type="submit"
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            )}

            {notFound && (
              <div className="alert alert-danger mt-3" role="alert">
                Employee with the provided ID does not exist.
              </div>
            )}

            {isSubmitted && (
              <form onSubmit={handleSubmitTwo}>
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
                      maxLength="30"
                      required
                      value={combinedObject.FirstName}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          FirstName: e.target.value,
                        })
                      }
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
                      placeholder="Doe"
                      maxLength="30"
                      value={combinedObject.MiddleName}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          MiddleName:
                            e.target.value === "" ? null : e.target.value,
                        })
                      }
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
                      maxLength="30"
                      required
                      value={combinedObject.LastName}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          LastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="dateOfBirth" className="form-label">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className={
                        errorFields.includes("dateOfBirth")
                          ? "error form-control"
                          : "form-control"
                      }
                      id="dateOfBirth"
                      name="dateOfBirth"
                      required
                      value={combinedObject.DateOfBirth}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          DateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number:
                    </label>
                    <input
                      type="tel"
                      className={
                        errorFields.includes("phoneNumber")
                          ? "error form-control"
                          : "form-control"
                      }
                      id="phoneNumber"
                      name="phoneNumber"
                      required
                      value={combinedObject.PhoneNumber}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          PhoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="email"
                      className={
                        errorFields.includes("email")
                          ? "error form-control"
                          : "form-control"
                      }
                      id="email"
                      name="emaill"
                      required
                      value={combinedObject.Email}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          Email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="position" className="form-label">
                      Position:
                    </label>
                    <select
                      className={
                        errorFields.includes("position")
                          ? "error form-select"
                          : "form-select"
                      }
                      id="position"
                      name="position"
                      value={combinedObject.Position}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          Position: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Position</option>
                      {positions.map((position, index) => (
                        <option key={index} value={position}>
                          {position}
                        </option>
                      ))}
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
                      value={combinedObject.SupUserID}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          SupUserID:
                            e.target.value === "" ? null : e.target.value,
                        })
                      }
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
                      className={
                        errorFields.includes("salary")
                          ? "error form-control"
                          : "form-control"
                      }
                      id="salary"
                      name="salary"
                      required
                      value={combinedObject.Salary}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          Salary: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="department" className="form-label">
                      Department:
                    </label>
                    <select
                      className="form-select"
                      id="department"
                      name="department"
                      value={combinedObject.DepName}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          DepName: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Department</option>
                      {departments.map((department, index) => (
                        <option key={index} value={department.DepName}>
                          {department.DepName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <label htmlFor="shift" className="form-label">
                      Shift:
                    </label>
                    <select
                      className={
                        errorFields.includes("shift")
                          ? "error form-select"
                          : "form-select"
                      }
                      id="shift"
                      name="shift"
                      value={combinedObject.ScheduleType}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          ScheduleType: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Shift</option>
                      {schedules.map((shift, index) => (
                        <option key={index} value={shift}>
                          {shift}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="street" className="form-label">
                      Street Address:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      name="street"
                      required
                      value={combinedObject.Street}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          Street: e.target.value,
                        })
                      }
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
                      required
                      value={combinedObject.City}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          City: e.target.value,
                        })
                      }
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
                      className={
                        errorFields.includes("state")
                          ? "error form-control"
                          : "form-control"
                      }
                      id="state"
                      name="state"
                      required
                      value={combinedObject.State}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          State: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="zipcode" className="form-label">
                      Zipcode:
                    </label>
                    <input
                      type="text"
                      className={
                        errorFields.includes("zipcode")
                          ? "error form-control"
                          : "form-control"
                      }
                      id="zipcode"
                      name="zipcode"
                      required
                      value={combinedObject.ZipCode}
                      onChange={(e) =>
                        setCombinedObject({
                          ...combinedObject,
                          ZipCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mt-6">
                  <div className="w-full px-3 text-center">
                    <button
                      id="button"
                      type="submit"
                      className="btn btn-primary"
                    >
                      Update Employee
                    </button>
                  </div>
                </div>
                {errors.length > 0 ? (
                  <ul className="error">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
              </form>
            )}
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Employee Updated Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
