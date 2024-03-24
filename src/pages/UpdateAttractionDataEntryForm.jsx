import React, { useState, useEffect } from "react";

export default function UpdateAttraction() {
  const [attractionName, setAttractionName] = useState("");
  const [attractionData, setAttractionData] = useState(null);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [attractions, setAttractions] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState([]);

  const attractionTypes = ["Ride", "Show"];

  useEffect(() => {
    const fetchAttractions = async () => {
      const response = await fetch("http://localhost:3001/getAttractions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        console.log("Failed to fetch attraction data");
      }
      if (response.ok) {
        setAttractions(json);
        setIsSet(true);
      }
    };

    fetchAttractions();
  }, []);

  const handleSubmitOne = async (e) => {
    e.preventDefault();
    setAttractionData(null);
    setisSubmitted(false);

    try {
      const response = await fetch(`http://localhost:3001/getAttraction/${encodeURIComponent(attractionName)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log(json);

      if (!response.ok) {
        console.log("Failed to fetch attraction data");
      }
      if (response.ok) {
        setAttractionData(json[0]);
        setisSubmitted(true);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleSubmitTwo = async (e) => {
    e.preventDefault();
    setCreationSuccess(false);

    const formData = attractionData;

    try {
      const response = await fetch(`http://localhost:3001/updateAttraction/${encodeURIComponent(attractionName)}`, {
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
              Update Attraction
            </h1>
            <div className="text-center">
              Please select the name of the Attraction you would like to update.
            </div>
            
            {isSet && (
            <form onSubmit={handleSubmitOne}>
              <div className="mb-3 mt-3">
                <label htmlFor="attractionName" className="form-label">
                  Select Attraction Name:
                </label>
                <input
                  list="attractions"
                  className="form-control"
                  id="attractionName"
                  name="attractionName"
                  value={attractionName}
                  onChange={(e) => setAttractionName(e.target.value)}
                />
                <datalist id="attractions">
                  {attractions.map((type, index) => (
                    <option key={index} value={type.NameOfAttraction} />
                  ))}
                </datalist>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button id="button" type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </form>)}

            {isSubmitted && (
              <form onSubmit={handleSubmitTwo}>
                <div className="row mb-3 mt-3">
                  <div className="col">
                    <label htmlFor="startOH" className="form-label">
                      Start Operating Hour:
                    </label>
                    <input
                      type="time"
                      className={errorFields.includes("startOperatingHour") ? "error form-control" : "form-control"}
                      id="startOH"
                      name="startOH"
                      value={attractionData.StartOperatingHour}
                      onChange={(e) =>
                        setAttractionData({
                          ...attractionData,
                          StartOperatingHour: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="endOH" className="form-label">
                      End Operating Hour:
                    </label>
                    <input
                      type="time"
                      className={errorFields.includes("endOperatingHour") ? "error form-control" : "form-control"}
                      id="endOH"
                      name="endOH"
                      value={attractionData.EndOperatingHour}
                      onChange={(e) =>
                        setAttractionData({
                          ...attractionData,
                          EndOperatingHour: e.target.value,
                        })
                      }
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
                      value={attractionData.NameOfAttraction}
                      onChange={(e) =>
                        setAttractionData({
                          ...attractionData,
                          NameOfAttraction: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="type" className="form-label">
                      Attraction Type:
                    </label>
                    <input
                      list="types"
                      className={errorFields.includes("type") ? "error form-control" : "form-control"}
                      id="type"
                      name="type"
                      value={attractionData.AttractionType}
                      onChange={(e) =>
                        setAttractionData({
                          ...attractionData,
                          AttractionType: e.target.value,
                        })
                      }
                    />
                    <datalist id="types">
                      {attractionTypes.map((type, index) => (
                        <option key={index} value={type} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="height" className="form-label">
                      Height Requirement in Feet (Enter 0 if no Height
                      Requirement):
                    </label>
                    <input
                      type="number"
                      className={errorFields.includes("height") ? "error form-control" : "form-control"}
                      id="height"
                      name="height"
                      value={attractionData.HeightRequirementInches}
                      onChange={(e) =>
                        setAttractionData({
                          ...attractionData,
                          HeightRequirementInches: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="weight" className="form-label">
                      Weight Limit in Pounds (Enter 0 if no Weight Limit):
                    </label>
                    <input
                      type="number"
                      className={errorFields.includes("weight") ? "error form-control" : "form-control"}
                      id="weight"
                      name="weight"
                      value={attractionData.WeightRequirementPounds}
                      onChange={(e) =>
                        setAttractionData({
                          ...attractionData,
                          WeightRequirementPounds: e.target.value,
                        })
                      }
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
                      className={errorFields.includes("capacity") ? "error form-control" : "form-control"}
                      id="capacity"
                      name="capacity"
                      value={attractionData.Capacity}
                      onChange={(e) =>
                        setAttractionData({
                          ...attractionData,
                          Capacity: e.target.value,
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
                      Update Attraction
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
            )}
            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Attraction Updated Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
