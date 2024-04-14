import React, { useState } from "react";
import { currentConfig } from "../config";

export default function AddAttraction() {
  const [creationSuccess, setCreationSuccess] = useState(false);

  const [startOperatingHour, setStartOperatingHour] = useState("");
  const [endOperatingHour, setEndOperatingHour] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Active");
  const [department, setDepartment] = useState("Attraction");

  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState([]);

  const attractionTypes = ["Ride", "Show"];

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;
  console.log(currentConfig.REACT_APP_API_BASE_URL);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);
    // Submit data to backend or perform further processing
    const formData = {
      startOperatingHour,
      endOperatingHour,
      name,
      type,
      height,
      weight,
      capacity,
      status,
      department,
    };

    try {
      const response = await fetch(`${baseURL}/addattraction`, {
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
        setStartOperatingHour("");
        setEndOperatingHour("");
        setName("");
        setType("");
        setHeight("");
        setWeight("");
        setCapacity("");
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
              Add Attraction
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3 mt-3">
                <div className="col">
                  <label htmlFor="startOH" className="form-label">
                    Start Operating Hour:
                  </label>
                  <input
                    type="time"
                    className={
                      errorFields.includes("startOperatingHour")
                        ? "error form-control"
                        : "form-control"
                    }
                    id="startOH"
                    name="startOH"
                    required
                    value={startOperatingHour}
                    onChange={(e) => setStartOperatingHour(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="endOH" className="form-label">
                    End Operating Hour:
                  </label>
                  <input
                    type="time"
                    className={
                      errorFields.includes("endOperatingHour")
                        ? "error form-control"
                        : "form-control"
                    }
                    id="endOH"
                    name="endOH"
                    required
                    value={endOperatingHour}
                    onChange={(e) => setEndOperatingHour(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="name" className="form-label">
                    Name of Attraction:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Twisted Waters"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="type" className="form-label">
                    Attraction Type:
                  </label>
                  <select
                    className={
                      errorFields.includes("type")
                        ? "error form-control"
                        : "form-control"
                    }
                    id="type"
                    name="type"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">Select Attraction Type</option>
                    {attractionTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="height" className="form-label">
                    Height Requirement in Inches (Enter 0 if no Height
                    Requirement):
                  </label>
                  <input
                    type="number"
                    className={
                      errorFields.includes("height")
                        ? "error form-control"
                        : "form-control"
                    }
                    id="height"
                    name="height"
                    placeholder="4.0"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="col">
                  <label htmlFor="weight" className="form-label">
                    Weight Limit in Pounds (Enter 0 if no Weight Limit):
                  </label>
                  <input
                    type="number"
                    className={
                      errorFields.includes("weight")
                        ? "error form-control"
                        : "form-control"
                    }
                    id="weight"
                    name="weight"
                    placeholder="355"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="capacity" className="form-label">
                    Attraction Capacity:
                  </label>
                  <input
                    type="number"
                    className={
                      errorFields.includes("capacity")
                        ? "error form-control"
                        : "form-control"
                    }
                    id="capacity"
                    name="capacity"
                    placeholder="1000"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Add Attraction
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
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Attraction Created Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
