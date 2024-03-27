import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const [vendors, setVendors] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState([]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);
    // Submit data to backend or perform further processing
    const formData = {
      name,
      vendor,
      acquisitionCost,
      price,
      description,
      status,
    };

    try {
      const response = await fetch(`${baseURL}/addproduct`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "product/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setErrors(json.errors);
        setErrorFields(json.errorFields);
      }
      if (response.ok) {
        setName("");
        setVendor("");
        setAcquisitionCost("");
        setPrice("");
        setDescription("");
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
              Add Product
            </h1>

            {isSet && (
            <form onSubmit={handleSubmit}>
              <div className="row mb-3 mt-3">
              <div className="col">
                  <label htmlFor="name" className="form-label">
                    Name of Product:
                  </label>
                  <input
                    type="text"
                    className={
                      errorFields.includes("name")
                        ? "error form-control"
                        : "form-control"
                    }
                    id="name"
                    name="name"
                    placeholder="Pizza Delight Bundle"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="vendor" className="form-label">
                    Select Vendor:
                  </label>
                  <input
                    list="vendors"
                    className="form-control"
                    id="vendor"
                    name="vendor"
                    placeholder="Type to search..."
                    required
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                  />
                  <datalist id="vendors">
                    {vendors.map((vendor, index) => (
                      <option key={index} value={vendor.NameOfVendor} />
                    ))}
                  </datalist>
                </div>
              </div>
              <div className="row mb-3 mt-3">
                <div className="col">
                  <label htmlFor="cost" className="form-label">
                    Acquisition Cost:
                  </label>
                  <input
                    type="number"
                    className={
                      errorFields.includes("acquisitionCost")
                        ? "error form-control"
                        : "form-control"
                    }
                    id="cost"
                    name="cost"
                    placeholder="5.00"
                    required
                    value={acquisitionCost}
                    onChange={(e) => setAcquisitionCost(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="price" className="form-label">
                    Sale Price:
                  </label>
                  <input
                    type="number"
                    className={
                      errorFields.includes("price")
                        ? "error form-control"
                        : "form-control"
                    }
                    id="price"
                    name="price"
                    placeholder="15.00"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3 mt-3">
                <div className="col">
                  <label htmlFor="desc" className="form-label">
                    Description of Product:
                  </label>
                  <textarea
                    className="form-control"
                    id="desc"
                    name="desc"
                    rows="5"
                    placeholder="Type the description of the product here..."
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Add Product
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
            </form>)}
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Product Created Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
