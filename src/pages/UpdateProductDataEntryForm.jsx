import React, { useState, useEffect } from "react";

export default function UpdateProduct() {
  const [productID, setProductID] = useState("");
  const [productData, setProductData] = useState(null);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const vendors = ["Adventure Bites Eatery", "Fantasy Finds Boutique"];

  useEffect(() => {
    if (productID) {
      /* Fetch product data from your backend based on the productID to be implemented later (backend)
          fetch(`your_api_endpoint/${productID}`)
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("Failed to fetch product data");
              }
            })
            .then((data) => setProductData(data))
            .catch((error) => setError(error.message));*/

      setProductData({
        name: "Pizza Delight Bundle",
        vendor: "Adventure Bites Eatery",
        inventory: "400",
        acquisitionCost: "5.00",
        salePrice: "15.00",
        description: "This product includes two slices of pizza and a drink.",
        status: "Active",
      });
    }
  }, [productID]);

  const handleSubmitOne = (e) => {
    e.preventDefault();
    setisSubmitted(true);
    // Form submission logic
    console.log(productData);
  };

  const handleSubmitTwo = (e) => {
    e.preventDefault();
    // Form submission logic
    console.log(productData);
    alert("Product Information has been Updated");
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
              Please enter the Product ID of the Product you would like to
              update.
            </div>
            <form onSubmit={handleSubmitOne}>
              <div className="mb-3 mt-3">
                <label htmlFor="productID" className="form-label">
                  Enter Product ID:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="productID"
                  name="productID"
                  placeholder="12345"
                  maxLength="10"
                  required
                  value={productID}
                  onChange={(e) => setProductID(e.target.value)}
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
                      Name of Product:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={productData.name}
                      onChange={(e) =>
                        setProductData({ ...productData, name: e.target.value })
                      }
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
                      value={productData.vendor}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          vendor: e.target.value,
                        })
                      }
                    />
                    <datalist id="vendors">
                      {vendors.map((vendor, index) => (
                        <option key={index} value={vendor} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="row mb-3 mt-3">
                  <div className="col">
                    <label htmlFor="inventory" className="form-label">
                      Current Inventory:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="inventory"
                      name="inventory"
                      value={productData.inventory}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          inventory: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="cost" className="form-label">
                      Acquisition Cost:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="cost"
                      name="cost"
                      value={productData.acquisitionCost}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          acquisitionCost: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3 mt-3">
                  <div className="col">
                    <label htmlFor="price" className="form-label">
                      Sale Price:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      placeholder="15.00"
                      required
                      value={productData.salePrice}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          salePrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="desc" className="form-label">
                      Description of Product:
                    </label>
                    <textarea
                      className="form-control"
                      id="desc"
                      name="desc"
                      rows="5"
                      value={productData.description}
                      onChange={(e) =>
                        setProductData({
                          ...productData,
                          description: e.target.value,
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
              </form>
            )}
            {error && <div>Error: {error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
