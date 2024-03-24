import React, { useState } from "react";

export default function AddAttractionLog() {
  const [attractionID, setAttractionID] = useState("");
  const [userID, setUserID] = useState("1234");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [operations, setOperations] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit data to backend or perform further processing
    setCurrentDate(new Date());
    const formData = {
      attractionID,
      userID,
      currentDate,
      operations,
    };
    console.log(formData);
    alert(
      `Daily Operational Log Info for Attraction:${attractionID} has been added`
    );
  };

  return (
    <div className="row justify-content-center">
      <div className="col md-4 mb-4">
        <div className="card dataEntryForm">
          <div className="card-body">
            <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
              Add to Attraction Log
            </h1>
            <div className="row mb-3 mt-3">
              <div className="col">
                <div className="form-label">
                  Date:
                </div>
                <div className="dateBox">
                    {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getDate()}, {currentDate.getFullYear()}
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3 mt-3">
                <div className="col">
                  <label htmlFor="attractionID" className="form-label">
                    AttractionID:
                  </label>
                  <input
                    type="numeric"
                    className="form-control"
                    id="attractionID"
                    name="attractionID"
                    required
                    value={attractionID}
                    onChange={(e) => setAttractionID(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="operations" className="form-label">
                    Operations:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="operations"
                    name="operations"
                    required
                    value={operations}
                    onChange={(e) => setOperations(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Add to Attraction Log
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
