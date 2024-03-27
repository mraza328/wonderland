import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function DeleteProduct() {
  const [itemID, setItemID] = useState("");
  const [productName, setProductName] = useState("");
  const [status, setStatus] = useState("Inactive");

  const [products, setProducts] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Fetch product data from your backend based on the productID to be implemented later (backend)
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
        setIsSet(true);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);

    const formData = {
      itemID,
      status,
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
              Delete Product
            </h1>
            <div className="text-center">
              Please select the name of the Product you would like to
              delete.
            </div>
            {isSet && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3 mt-3">
              <label htmlFor="itemID" className="form-label">
                  Select Product Name:
                </label>
                <input
                  list="products"
                  className="form-select"
                  id="itemID"
                  name="itemID"
                  placeholder="12345"
                  required
                  value={productName}
                  onChange={(e) => {
                    const pName = e.target.value;
                    setProductName(pName);

                    const foundProduct = products.find(product => product.NameOfItem === pName)
                    if(foundProduct){
                      setItemID(foundProduct.ItemID);
                    }
                  }}
                />
                <datalist id="products">
                  {products.map((type, index) => (
                    <option key={index} value={type.NameOfItem} />
                  ))}
                </datalist>
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
                  <button id="button" type="submit" className="btn btn-primary">
                    Delete Product
                  </button>
                </div>
              </div>
            </form>)}

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