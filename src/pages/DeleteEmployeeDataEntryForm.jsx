import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";
import { useAuth } from "../context/AuthContext";

export default function DeleteEmployee() {
  const { currentUser } = useAuth();
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeID, setEmployeeID] = useState("");
  const [reason, setReason] = useState("");
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isReasonSelected, setIsReasonSelected] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const reasons = ["Retired", "Inactive"];
  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${baseURL}/getalldepartments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }

        const json = await response.json();
        setDepartments(json);
      } catch (error) {
        console.error("Error fetching departments:", error.message);
      }
    };

    fetchDepartments();
  }, []);

  const fetchEmployeesByDepartment = async () => {
    try {
      const response = await fetch(`${baseURL}/getemployeesbydepartment`, {
        method: "POST",
        body: JSON.stringify({ department: employeeDepartment }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const json = await response.json();
      setEmployees(json);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    }
  };

  useEffect(() => {
    if (employeeDepartment) {
      fetchEmployeesByDepartment();
    }
  }, [employeeDepartment]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);
    setError("");

    const formData = {
      employeeID,
      status: reason,
    };

    try {
      const response = await fetch(`${baseURL}/deleteemployee`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setCreationSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setIsReasonSelected(e.target.value !== "");
  };

  return (
    <div className="row justify-content-center">
      <div className="col md-4 mb-4">
        <div className="card dataEntryForm">
          <div className="card-body">
            <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
              Delete Employee
            </h1>
            <div className="text-center">
              Please select the department and employee you want to delete.
            </div>
            <form onSubmit={handleSubmit}>
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
                  <label htmlFor="employeeID" className="form-label">
                    Select Employee:
                  </label>
                  <select
                    className="form-select"
                    id="employeeID"
                    name="employeeID"
                    value={employeeID}
                    onChange={(e) => setEmployeeID(e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employees.filter((employee) => {
                      const isDepartmentManager =
                        currentUser &&
                        currentUser.Position === "Department Manager";
                      return !(
                        isDepartmentManager &&
                        employee.Position === "Department Manager"
                      );
                    }).length > 0 ? (
                      employees
                        .filter((employee) => {
                          const isDepartmentManager =
                            currentUser &&
                            currentUser.Position === "Department Manager";
                          return !(
                            isDepartmentManager &&
                            employee.Position === "Department Manager"
                          );
                        })
                        .map((employee) => (
                          <option key={employee.UserID} value={employee.UserID}>
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
              {employeeID && (
                <div className="mb-3 mt-3">
                  <label htmlFor="reason" className="form-label">
                    Reason for Deletion:
                  </label>
                  <select
                    className="form-select"
                    id="reason"
                    name="reason"
                    value={reason}
                    onChange={handleReasonChange}
                  >
                    <option value="">Select Reason</option>
                    {reasons.map((reason, index) => (
                      <option key={index} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowConfirmation(true)}
                  >
                    Delete Employee
                  </button>
                </div>
                {showConfirmation && (
                  <div className="w-full px-3 text-center mt-3">
                    <p>
                      Are you sure you want to delete this employee? This action
                      is permanent.
                    </p>
                    <button
                      type="button"
                      className="btn btn-danger mx-2"
                      onClick={handleSubmit}
                      disabled={!isReasonSelected}
                    >
                      Confirm Delete Employee
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary mx-2"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Employee Deleted Successfully!
              </div>
            )}
            {error && (
              <div className="alert alert-danger my-3" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
