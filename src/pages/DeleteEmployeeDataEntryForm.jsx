import React, { useState } from "react";
import { currentConfig } from "../config";

export default function DeleteEmployee() {
  const [employeeID, setEmployeeID] = useState("");
  const [reason, setReason] = useState("");
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isReasonSelected, setIsReasonSelected] = useState(false);

  const reasons = ["Retired", "Inactive"];

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

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

      const json = await response.json();

      if (!response.ok) {
        setError(json.message);
      }
      if (response.ok) {
        setCreationSuccess(true);
      }
    } catch (error) {
      console.log("Error:", error.message);
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
              Please enter the Employee ID of the Employee you would like to
              delete.
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 mt-3">
                <label htmlFor="employeeID" className="form-label">
                  Employee ID:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="employeeID"
                  name="employeeID"
                  placeholder="12345"
                  maxLength="10"
                  required
                  value={employeeID}
                  onChange={(e) => setEmployeeID(e.target.value)}
                />
              </div>
              <div className="mb-3 mt-3">
                <label htmlFor="reason" className="form-label">
                  Reason:
                </label>
                <select
                  className="form-select"
                  id="reason"
                  name="reason"
                  value={reason}
                  onChange={handleReasonChange}
                  required
                >
                  <option value="">Select Reason</option>
                  {reasons.map((reason, index) => (
                    <option key={index} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button
                    id="button"
                    type="submit"
                    className="btn btn-primary"
                    disabled={!isReasonSelected}
                  >
                    Delete Employee
                  </button>
                </div>
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
