import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function DeleteProduct() {
  const [itemID, setItemID] = useState("");
  const [status, setStatus] = useState("Inactive");
  const [products, setProducts] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [vendors, setVendors] = useState([]);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reason, setReason] = useState("");

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
      console.log(json);

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

  const fetchProductsByVendor = async () => {
    try {
      const response = await fetch(`${baseURL}/getproductsbyvendor`, {
        method: "POST",
        body: JSON.stringify({ vendorName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("Failed to fetch products for the selected vendor");
        return;
      }

      const json = await response.json();
      setProducts(json);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  useEffect(() => {
    if (vendorName) {
      fetchProductsByVendor();
    }
  }, [vendorName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);

    const formData = {
      itemID,
      status,
      reason,
    };

    try {
      const response = await fetch(`${baseURL}/deleteproduct`, {
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
              Delete Product
            </h1>
            <div className="text-center">
              Please select the name of the Product you would like to delete.
            </div>
            {isSet && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
                  <label htmlFor="vendorName" className="form-label">
                    Select Product's Vendor:
                  </label>
                  <select
                    className="form-select"
                    id="vendorName"
                    name="vendorName"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                  >
                    <option value="">Select vendor...</option>
                    {vendors.map((vendor, index) => (
                      <option key={index} value={vendor.NameOfVendor}>
                        {`${vendor.NameOfVendor} (${vendor.VendorType})`}
                      </option>
                    ))}
                  </select>
                </div>
                {vendorName && (
                  <div className="mb-3 mt-3">
                    <label htmlFor="itemID" className="form-label">
                      Select Product Name:
                    </label>
                    <select
                      className="form-select"
                      id="itemID"
                      name="itemID"
                      required
                      value={itemID}
                      onChange={(e) => setItemID(e.target.value)}
                    >
                      <option value="">Select product...</option>
                      {products.length === 0 ? (
                        <option value="" disabled>
                          No products found in this department
                        </option>
                      ) : (
                        products.map((product, index) => (
                          <option key={index} value={product.ItemID}>
                            {product.NameOfItem}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
                {vendorName && itemID && (
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
                )}
                <div className="flex flex-wrap -mx-3 mt-6">
                  <div className="w-full px-3 text-center">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => setShowConfirmation(true)}
                    >
                      Delete Product
                    </button>
                  </div>
                  {showConfirmation && (
                    <div className="w-full px-3 text-center mt-3">
                      <p>
                        Are you sure you want to delete this product? This
                        action is permanent.
                      </p>
                      <button
                        type="button"
                        className="btn btn-danger mx-2"
                        onClick={handleSubmit}
                      >
                        Confirm Delete Product
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
            )}
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Product Deleted Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
