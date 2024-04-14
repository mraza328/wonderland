import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function UpdateDepartment() {
  const [department, setDepartment] = useState("");
  const [departmentData, setDepartmentData] = useState(null);
  const [isSubmitted, setisSubmitted] = useState(false);

  const [departments, setDepartments] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [isMggrChange, setIsMggrChange] = useState(false);

  const [oldMggrUserID, setOldMggrUserID] = useState("");
  const positions = ["Employee", "Maintenance", "Admin"];

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

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

  const handleSubmitOne = async (e) => {
    e.preventDefault();
    setDepartmentData(null);
    setisSubmitted(false);
    setCreationSuccess(false);
    // Form submission logic

    const formData = { department };
    try {
      const response = await fetch(`${baseURL}/getdepartment`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log("Failed to fetch employee data");
      }
      if (response.ok) {
        const departmentDataFromJson = json[0];

        setDepartmentData({
          ...departmentDataFromJson,
          OldManagerUserID: departmentDataFromJson.ManagerUserID,
          OldDepartmentName: departmentDataFromJson.DepName,
          newDepartment: "",
          newPosition: "",
          newSupID: "",
        });

        setisSubmitted(true);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleSubmitTwo = async (e) => {
    e.preventDefault();
    setCreationSuccess(false);

    const formData = departmentData;
    console.log(formData);

    try {
      const response = await fetch(`${baseURL}/updatedepartment`, {
        method: "PUT",
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
              Update Department
            </h1>
            <div className="text-center">
              Please select the Department you would like to update.
            </div>

            {isSet && (
              <form onSubmit={handleSubmitOne}>
                <div className="mb-3 mt-3">
                  <label htmlFor="departmentS" className="form-label">
                    Select Department:
                  </label>
                  <select
                    className="form-select"
                    id="departmentS"
                    name="departmentS"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">Select department...</option>
                    {departments.map((department, index) => (
                      <option key={index} value={department.DepName}>
                        {department.DepName}
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
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            )}

            {isSubmitted && (
              <form onSubmit={handleSubmitTwo}>
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
                      required
                      value={departmentData.DepName}
                      onChange={(e) =>
                        setDepartmentData({
                          ...departmentData,
                          DepName: e.target.value,
                        })
                      }
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
                      required
                      value={departmentData.ManagerUserID}
                      onChange={(e) => {
                        const newManagerUserID = parseInt(e.target.value);
                        setDepartmentData({
                          ...departmentData,
                          ManagerUserID: newManagerUserID,
                        });
                        setIsMggrChange(true);
                      }}
                    />
                  </div>
                </div>

                {isMggrChange && (
                  <div>
                    <div className="row mb-3 mt-3">
                      <div className="col">
                        <label htmlFor="oldmggr" className="form-label">
                          Old Department Manager's EmployeeID:
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="oldmggr"
                          name="oldmggr"
                          value={departmentData.OldManagerUserID}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="newPosition" className="form-label">
                          Old Manager's New Position:
                        </label>
                        <input
                          list="positions"
                          className="form-control"
                          id="newPosition"
                          name="newPosition"
                          required
                          value={departmentData.newPosition}
                          onChange={(e) =>
                            setDepartmentData({
                              ...departmentData,
                              newPosition: e.target.value,
                            })
                          }
                        />
                        <datalist id="positions">
                          {positions.map((type, index) => (
                            <option key={index} value={type} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                    <div className="row mb-3 mt-3">
                      <div className="col">
                        <label htmlFor="oldmggr" className="form-label">
                          Old Manager's New Supervisor's EmployeeID:
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="oldmggr"
                          name="oldmggr"
                          required
                          value={departmentData.newSupID}
                          onChange={(e) =>
                            setDepartmentData({
                              ...departmentData,
                              newSupID: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="departme" className="form-label">
                          Old Manager's New Department:
                        </label>
                        <input
                          list="departmes"
                          className="form-control"
                          id="departme"
                          name="departme"
                          required
                          value={departmentData.newDepartment}
                          onChange={(e) =>
                            setDepartmentData({
                              ...departmentData,
                              newDepartment: e.target.value,
                            })
                          }
                        />
                        <datalist id="departmes">
                          {departments.map((type, index) => (
                            <option key={index} value={type.DepName} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap -mx-3 mt-6">
                  <div className="w-full px-3 text-center">
                    <button
                      id="button"
                      type="submit"
                      className="btn btn-primary"
                    >
                      Update Department
                    </button>
                  </div>
                </div>
              </form>
            )}
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Department Updated Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
