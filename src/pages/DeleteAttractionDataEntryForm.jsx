import React, { useState, useEffect } from "react";

export default function DeleteAttraction() {
    const [attractionName, setAttractionName] = useState("");
    const [status, setStatus] = useState("Inactive");
    const [attractions, setAttractions] = useState(null);
    const [isSet, setIsSet] = useState(false);
    const [creationSuccess, setCreationSuccess] = useState(false);

    useEffect(() => {
      // Fetch attraction data from your backend based on the attractionID to be implemented later (backend)
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setCreationSuccess(false);
    
        const formData = {
          attractionName, 
          status
        };
    
        try {
          const response = await fetch(`http://localhost:3001/deleteAttraction/${encodeURIComponent(attractionName)}`, {
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
                    Delete Attraction
                  </button>
                </div>
              </div>
            </form>)}

            {creationSuccess && (
              <div className="alert alert-success my-3" role="alert">
                Attraction Deleted Successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    )
}