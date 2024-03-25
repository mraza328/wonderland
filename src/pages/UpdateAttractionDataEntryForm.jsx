import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function UpdateAttraction() {
  const [attractionName, setAttractionName] = useState("");
  const [attractionData, setAttractionData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Adjusted from setisSubmitted for naming convention
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorFields, setErrorFields] = useState([]);

  const [attractions, setAttractions] = useState(null);
  const [isSet, setIsSet] = useState(false);

  const attractionTypes = ["Ride", "Show"];

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchAttractions = async () => {
      const response = await fetch(`${baseURL}/getallattractions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch attraction data");
      } else {
        // Filter the attractions to only include those with an "Active" status
        const activeAttractions = json.filter(
          (attraction) => attraction.AttractionStatus === "Active"
        );
        setAttractions(activeAttractions);
        setIsSet(true);
      }
    };

    fetchAttractions();
  }, []);

  const handleSelectSubmit = async (e) => {
    e.preventDefault();

    // Here you would filter out the selected attraction from the `attractions` state
    // Since the attractions are already fetched, no need to fetch a single attraction again
    const selectedAttraction = attractions.find(
      (attraction) => attraction.NameOfAttraction === attractionName
    );
    if (selectedAttraction) {
      setAttractionData(selectedAttraction);
      setIsSubmitted(true);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setCreationSuccess(false);
    setErrors([]);
    setErrorFields([]);

    // Assuming attractionData includes all necessary fields
    const formData = {
      ...attractionData,
      startOperatingHour: attractionData.StartOperatingHour,
      endOperatingHour: attractionData.EndOperatingHour,
      nameOfAttraction: attractionData.NameOfAttraction,
      attractionType: attractionData.AttractionType,
      heightRequirementInches: attractionData.HeightRequirementInches,
      weightRequirementPounds: attractionData.WeightRequirementPounds,
      capacity: attractionData.Capacity,
      attractionStatus: attractionData.AttractionStatus,
      depName: "Attraction",
    };
    console.log("FormData being sent:", formData);

    try {
      const response = await fetch(`${baseURL}/updateattraction`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setErrors(json.errors || ["An unknown error occurred"]);
        setErrorFields(json.errorFields || []);
        console.error(
          "Server responded with errors:",
          json.errors,
          "Fields:",
          json.errorFields
        );
      } else {
        setCreationSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-11">
        <div className="card dataEntryForm">
          <div className="card-body">
            <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
              Update Attraction
            </h1>

            {!isSubmitted ? (
              <>
                <div className="text-center mb-4">
                  Please select the name of the Attraction you would like to
                  update.
                </div>
                {isSet && (
                  <form onSubmit={handleSelectSubmit}>
                    <div className="mb-3">
                      <label htmlFor="attractionName" className="form-label">
                        Select Attraction Name:
                      </label>
                      <select
                        className="form-select"
                        id="attractionName"
                        name="attractionName"
                        value={attractionName}
                        onChange={(e) => setAttractionName(e.target.value)}
                      >
                        <option value="">Please select...</option>
                        {attractions.map((attraction, index) => (
                          <option
                            key={index}
                            value={attraction.NameOfAttraction}
                          >
                            {attraction.NameOfAttraction}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary">
                        Select Attraction
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-3">
                  <label htmlFor="startOH" className="form-label">
                    Start Operating Hour:
                  </label>
                  <input
                    type="time"
                    className="form-control"
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
                <div className="mb-3">
                  <label htmlFor="endOH" className="form-label">
                    End Operating Hour:
                  </label>
                  <input
                    type="time"
                    className="form-control"
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
                <div className="mb-3">
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
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">
                    Attraction Type:
                  </label>
                  <input
                    list="types"
                    className="form-control"
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
                <div className="mb-3">
                  <label htmlFor="height" className="form-label">
                    Height Requirement (in inches):
                  </label>
                  <input
                    type="number"
                    className="form-control"
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
                <div className="mb-3">
                  <label htmlFor="weight" className="form-label">
                    Weight Limit (in pounds):
                  </label>
                  <input
                    type="number"
                    className="form-control"
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
                <div className="mb-3">
                  <label htmlFor="capacity" className="form-label">
                    Attraction Capacity:
                  </label>
                  <input
                    type="number"
                    className="form-control"
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
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-success">
                    Update Attraction
                  </button>
                </div>
              </form>
            )}
            {creationSuccess && (
              <div className="alert alert-success mt-3" role="alert">
                Attraction Updated Successfully!
              </div>
            )}
            {errors.length > 0 && (
              <div className="alert alert-danger mt-3">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
