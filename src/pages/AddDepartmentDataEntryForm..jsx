import React, { useState } from "react";
import { currentConfig } from "../config";

export default function AddDepartment() {
  const [name, setName] = useState("");
  const [hoursWorked, setHoursWorked] = useState('35');
  const [mggrUserID, setMggrUserID] = useState("");
  const [creationSuccess, setCreationSuccess] = useState(false);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);
    // Submit data to backend or perform further processing
    const formData = {
      name,
      hoursWorked,
      mggrUserID,
    };
    
    try {
      const response = await fetch(`${baseURL}/adddepartment`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log("There was an error");
      }
      if (response.ok) {
        setName("");
        setMggrUserID("");
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
              Add Department
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3 mt-3">
                <div className="col">
                  <label htmlFor="name" className="form-label">
                    Department Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Sales"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="mggr" className="form-label">
                    Department Manager's EmployeeID:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="mggr"
                    name="mggr"
                    placeholder="12345"
                    required
                    value={mggrUserID}
                    onChange={(e) => setMggrUserID(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Add Department
                  </button>
                </div>
              </div>
            </form>
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Department Created Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
