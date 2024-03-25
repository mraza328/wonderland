import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function DeleteAttraction() {
  const [attractionName, setAttractionName] = useState("");
  const [status, setStatus] = useState("Inactive");
  const [attractions, setAttractions] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const baseURL = currentConfig.REACT_APP_API_BASE_URL;
  console.log(currentConfig.REACT_APP_API_BASE_URL);

  useEffect(() => {
    const fetchAttractions = async () => {
      const response = await fetch(`${baseURL}/getallattractions`, {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreationSuccess(false);

    const formData = {
      name: attractionName,
      status,
    };

    try {
      const response = await fetch(`${baseURL}/deleteattraction`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(`Error: ${response.message}`);
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
              Delete Attraction
            </h1>
            <div className="text-center">
              Please select the name of the Attraction you would like to delete.
            </div>

            {isSet && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3 mt-3">
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
                    <option value="">Please select an attraction</option>
                    {attractions.map((attraction, index) => (
                      <option key={index} value={attraction.NameOfAttraction}>
                        {attraction.NameOfAttraction}
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
                      Delete Attraction
                    </button>
                  </div>
                </div>
              </form>
            )}

            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Attraction Deleted Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
