import React, { useState } from "react";
import { currentConfig } from "../config";

export default function AddVendor() {
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("Active");
  const [department, setDepartment] = useState("Vendor");

  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState([]);

  const vendorTypes = ["Food", "Merchandise"];

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);

    const formData = {
      name,
      type,
      status,
      department,
    };

    try {
      const response = await fetch(`${baseURL}/addvendor`, {
        method: "POST",
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
        setName("");
        setType("");
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
              Add Vendor
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3 mt-3">
                <div className="col">
                  <label htmlFor="name" className="form-label">
                    Name of Vendor:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Flowery Boutique"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="type" className="form-label">
                    Vendor Type:
                  </label>
                  <select
                    className="form-control"
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Please select...</option>
                    {vendorTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Add Vendor
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
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Vendor Added Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
