import React, { useState } from "react";

export default function DeleteProduct() {
  const [productID, setProductID] = useState("");
  const [status, setStatus] = useState("");

  const reasons = ["Out of Order", "Inactive"];

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      productID,
      status,
    };

    console.log(formData);
    alert("Product has been Deleted");
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
              Please enter the Product ID of the Product you would like to
              delete.
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 mt-3">
                <label htmlFor="productID" className="form-label">
                  Product ID:
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
              <div className="mb-3 mt-3">
                <label htmlFor="status" className="form-label">
                  Reason:
                </label>
                <input
                  list="reasons"
                  className="form-control"
                  id="status"
                  name="status"
                  placeholder="Type to search..."
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <datalist id="reasons">
                  {reasons.map((status, index) => (
                    <option key={index} value={status} />
                  ))}
                </datalist>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Delete Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
