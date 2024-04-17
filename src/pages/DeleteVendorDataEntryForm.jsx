import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function DeleteVendor() {
  const [vendorName, setVendorName] = useState("");
  const [status, setStatus] = useState("Inactive");
  const [vendors, setVendors] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Fetch vendor data from your backend based on the vendorName to be implemented later (backend)
    const fetchVendors = async () => {
      const response = await fetch(`${baseURL}/getallvendors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch vendor data");
        return;
      }
      if (response.ok) {
        setVendors(json);
        setIsSet(true);
      }
    };

    fetchVendors();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);

    const formData = {
      vendorName,
      status,
    };

    try {
      const response = await fetch(`${baseURL}/deletevendor`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(`Error: ${response.message}`);
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
              Delete Vendor
            </h1>
            <div className="text-center">
              Please select the Name of the Vendor you would like to delete.
            </div>

            {isSet && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                  <label htmlFor="vendorName" className="form-label">
                    Vendor Name:
                  </label>
                  <select
                    className="form-select"
                    id="vendorName"
                    name="vendorName"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                  >
                    <option value="">Please select...</option>
                    {vendors.map((vendor, index) => (
                      <option key={index} value={vendor.NameOfVendor}>
                        {vendor.NameOfVendor}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="status" className="form-label">
                    Reason:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="status"
                    name="status"
                    readOnly
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap -mx-3 mt-6">
                  <div className="w-full px-3 text-center">
                    <button
                      id="button"
                      type="submit"
                      className="btn btn-danger"
                    >
                      Delete Vendor
                    </button>
                  </div>
                </div>
              </form>
            )}

            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Vendor Deleted Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
