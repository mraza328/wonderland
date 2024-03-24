import React, { useState } from "react";

export default function DeleteEmployee() {
  const [employeeID, setEmployeeID] = useState("");
  const [status, setStatus] = useState("");
  const [creationSuccess, setCreationSuccess] = useState(false);

  const reasons = ["Retired", "Inactive"];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);

    const formData = {
      employeeID, 
      status
    };

    try {
      const response = await fetch(`http://localhost:3001/deleteEmployee/${encodeURIComponent(employeeID)}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(`Error: ${response.message}`)
      }
      if (response.ok) {
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
              <label htmlFor="status" className="form-label">
                Reason:
              </label>
              <input
                list="reasons"
                className="form-control"
                id="status"
                name="status"
                placeholder="Type to search..."
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />
              <datalist id="reasons">
                {reasons.map((status, index) => (
                  <option key={index} value={status} />
                ))}
              </datalist>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
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
          </div>
        </div>
      </div>
    </div>
  );
}
