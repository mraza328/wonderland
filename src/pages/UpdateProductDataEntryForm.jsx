import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function UpdateProduct() {
  const [itemID, setItemID] = useState("");
  const [productName, setProductName] = useState("");
  const [productData, setProductData] = useState(null);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [vendors, setVendors] = useState(null);
  const [products, setProducts] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState([]);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${baseURL}/getallproducts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        console.log("Failed to fetch product data");
      }
      if (response.ok) {
        setProducts(json);
      }
    };

    fetchProducts();
  }, []); // [itemID]);

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
        console.log("Failed to fetch product data");
      }
      if (response.ok) {
        setVendors(json);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    if (products && vendors) {
      setIsSet(true);
    }
  }, [products, vendors]);

  const handleSubmitOne = async (e) => {
    e.preventDefault();
    setProductData(null);
    setisSubmitted(false);
    // Form submission logic

    const formData = { itemID };

    try {
      const response = await fetch(`${baseURL}/getproduct`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        console.log("Failed to fetch product data");
      }
      if (response.ok) {
        setProductData(json[0]);
        setisSubmitted(true);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleSubmitTwo = async (e) => {
    e.preventDefault();
    setCreationSuccess(false);

    const formData = productData;

    try {
      const response = await fetch(`${baseURL}/updateproduct`, {
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
              Update Product
            </h1>
            <div className="text-center">
              Please select the name of the Product you would like to update.
            </div>

            {isSet && (
              <form onSubmit={handleSubmitOne}>
                <div className="mb-3 mt-3">
                  <label htmlFor="itemID" className="form-label">
                    Select Product Name:
                  </label>
                  <select
                    className="form-select"
                    id="itemID"
                    name="itemID"
                    required
                    value={productName}
                    onChange={(e) => {
                      const pName = e.target.value;
                      setProductName(pName);

                      const foundProduct = products.find(
                        (product) => product.NameOfItem === pName
                      );
                      if (foundProduct) {
                        setItemID(foundProduct.ItemID);
                      }
                    }}
                  >
                    <option value="">Select product...</option>
                    {products.map((product, index) => (
                      <option key={index} value={product.NameOfItem}>
                        {product.NameOfItem}
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
                      value={productData.NameOfItem}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          NameOfItem: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="vendor" className="form-label">
                      Select Vendor:
                    </label>
                    <select
                      className="form-select"
                      id="vendor"
                      name="vendor"
                      value={productData.NameOfVendor}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          NameOfVendor: e.target.value,
                        })
                      }
                    >
                      <option value="">Select vendor...</option>
                      {vendors.map((vendor, index) => (
                        <option key={index} value={vendor.NameOfVendor}>
                          {vendor.NameOfVendor}
                        </option>
                      ))}
                    </select>
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
                      value={productData.AcquisitionCost}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          AcquisitionCost: e.target.value,
                        })
                      }
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
                      value={productData.SalePrice}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          SalePrice: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3 mt-3">
                  <div className="col">
                    <label htmlFor="desc" className="form-label">
                      Description of Product:
                    </label>
                    <textarea
                      className={
                        errorFields.includes("Description")
                          ? "error form-control"
                          : "form-control"
                      }
                      id="desc"
                      name="desc"
                      rows="5"
                      value={productData.Description}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          Description: e.target.value,
                        })
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
                      Update Product
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
            )}
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Product Updated Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
