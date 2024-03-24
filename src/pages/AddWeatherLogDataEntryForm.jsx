import React, { useState } from "react";

export default function AddWeatherLog() {
  const [dateOfClosure, setDateOfClosure] = useState("");
  const [reason, setReason] = useState("");
  const [userID, setUserID] = useState("");
  const [weatherType, setWeatherType] = useState("");

  const [creationSuccess, setCreationSuccess] = useState(false);

  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState([]);

  const weatherTypes = ['Rainy', 'Tornado Alert', 'Hurricane Alert', 'Excessive Heat Watch', 'Winter Storm', 'Flooding', 'Other'];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);
    // Submit data to backend or perform further processing
    const formData = {
      userID,
      dateOfClosure,
      weatherType,
      reason,
    };
  
    try {
      const response = await fetch("http://localhost:3001/addWeatherLog", {
        method: "POST",
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
        setUserID("");
        setDateOfClosure("");
        setWeatherType("");
        setReason("");
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
              Shut Down Park
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3 mt-3">
                <div className="col">
                  <label htmlFor="ids" className="form-label">
                    Employee UserID:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="ids"
                    name="ids"
                    required
                    value={userID}
                    onChange={(e) => setUserID(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="date" className="form-label">
                    Date of Closure:
                  </label>
                  <input
                    type="date"
                    className={errorFields.includes("dateOfClosure") ? "error form-control" : "form-control"}
                    id="date"
                    name="date"
                    required
                    value={dateOfClosure}
                    onChange={(e) => setDateOfClosure(e.target.value)}
                  />
                </div>
                </div>
                <div className="mb-3 mt-3">
                <div className="col mb-3 mt-3">
                  <label htmlFor="weatherType" className="form-label">
                    Weather Type:
                  </label>
                  <input
                    list="weatherTypes"
                    className={errorFields.includes("weatherType") ? "error form-control" : "form-control"}
                    id="weatherType"
                    name="weatherType"
                    max-length="255"
                    required
                    value={weatherType}
                    onChange={(e) => setWeatherType(e.target.value)}
                  />
                  <datalist id="weatherTypes">
                    {weatherTypes.map((type, index) => (
                      <option key={index} value={type} />
                    ))}
                  </datalist>
                </div>
                <div className="col mb-3 mt-3">
                  <label htmlFor="reason" className="form-label">
                    Description:
                  </label>
                  <textarea
                    className="form-control"
                    id="reason"
                    name="reason"
                    max-length="350"
                    rows="5"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Add to Weather Log
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
            </form>
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Added to Weather Log Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
