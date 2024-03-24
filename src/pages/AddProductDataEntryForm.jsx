import React, { useState } from "react";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [inventory, setInventory] = useState("");
  const [acquisitinCost, setAcquisitinCost] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const vendors = ["Adventure Bites Eatery", "Fantasy Finds Boutique"];

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit data to backend or perform further processing
    const formData = {
      name,
      vendor,
      inventory,
      acquisitinCost,
      price,
      description,
      status,
    };
    console.log(formData);
    alert("Product has been added");
  };

  return (
    <div className="row justify-content-center">
      <div className="col md-4 mb-4">
        <div className="card dataEntryForm">
          <div className="card-body">
            <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
              Add Product
            </h1>
            <form onSubmit={handleSubmit}>
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
                    placeholder="400"
                    required
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
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
                    placeholder="5.00"
                    required
                    value={acquisitinCost}
                    onChange={(e) => setAcquisitinCost(e.target.value)}
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
