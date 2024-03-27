import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function UpdateVendor() {
  const [vendorName, setVendorName] = useState("");
  const [vendorData, setVendorData] = useState(null);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [vendors, setVendors] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const vendorTypes = ["Concession Stand", "Gift Shop"];

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchVendors = async () => {
      const response = await fetch(`${baseURL}/getallvendors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log("Failed to fetch vendor data");
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

    const formData = {vendorName};

    try {
      const response = await fetch(`${baseURL}/getvendor`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      json[0].origVendorName = json[0].NameOfVendor;
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
      const response = await fetch(`${baseURL}/updatevendor`, {
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
              Update Vendor
            </h1>
            <div className="text-center">
              Please select the Name of the Vendor you would like to update.
            </div>

            {isSet && (
            <form onSubmit={handleSubmitOne}>
              <div className="mb-3 mt-3">
                <label htmlFor="vendorName" className="form-label">
                  Select Vendor Name:
                </label>
                <input
                  list="vendors"
                  className="form-select"
                  id="vendorName"
                  name="vendorName"
                  placeholder="Type to search..."
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
                <datalist id="vendors">
                    {vendors.map((vendor, index) => (
                      <option key={index} value={vendor.NameOfVendor} />
                    ))}
                  </datalist>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </form>)}

            {isSubmitted && (
              <form onSubmit={handleSubmitTwo}>
                <div className="row mb-3 mt-3">
                  <div className="col">
                    <label htmlFor="name" className="form-label">
                      Vendor Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={vendorData.NameOfVendor}
                      onChange={(e) =>
                        setVendorData({ ...vendorData, NameOfVendor: e.target.value })
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

