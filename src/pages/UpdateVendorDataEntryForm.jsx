import React, { useState, useEffect } from "react";

export default function UpdateVendor() {
  const [vendorName, setVendorName] = useState("");
  const [vendorData, setVendorData] = useState(null);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [attractions, setVendors] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState([]);

  const vendorTypes = ["Concession Stand", "Gift Shop"];

  useEffect(() => {
    const fetchVendors = async () => {
      const response = await fetch("http://localhost:3001/getVendors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        console.log("Failed to fetch attraction data");
      }
      if (response.ok) {
        setVendors(json);
        setIsSet(true);
      }
    };

    fetchVendors();
  }, []);

  const handleSubmitOne = async (e) => {
    e.preventDefault();
    setVendorData(null);
    setisSubmitted(false);

    try {
      const response = await fetch(`http://localhost:3001/getVendor/${encodeURIComponent(vendorName)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        console.log("Failed to fetch attraction data");
      }
      if (response.ok) {
        setVendorData(json[0]);
        setisSubmitted(true);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleSubmitTwo = async (e) => {
    e.preventDefault();
    setCreationSuccess(false);

    const formData = vendorData;

    try {
      const response = await fetch(`http://localhost:3001/updateVendor/${encodeURIComponent(vendorName)}`, {
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
              Update Vendor
            </h1>
            <div className="text-center">
              Please enter the Name of the Vendor you would like to update.
            </div>
            <form onSubmit={handleSubmitOne}>
              <div className="mb-3 mt-3">
                <label htmlFor="vendorName" className="form-label">
                  Enter Vendor Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="vendorName"
                  name="vendorName"
                  placeholder="ABC"
                  maxLength="10"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </form>

            {isSubmitted && (
              <form onSubmit={handleSubmitTwo}>
                <div className="row mb-3 mt-3">
                  <div className="col">
                    <label htmlFor="name" className="form-label">
                      Enter a new name for the Vendor:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={vendorData.name}
                      onChange={(e) =>
                        setVendorData({ ...vendorData, name: e.target.value })
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
                      Update Vendor
                    </button>
                  </div>
                </div>
                {errors.length>0 ?  (
                <ul className="error">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              ) : ""}
              </form>
            )}
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Vendor Updated Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

