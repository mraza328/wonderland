import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { currentConfig } from "../config";
import Swal from "sweetalert2";

export default function MaintenanceCompReq({ onSuccess }) {
  const [selectedRequest, setSelectedRequest] = useState("");
  const [requestsData, setRequestsData] = useState([]);
  const { currentUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [costChangedByUser, setCostChangedByUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;
  console.log(currentConfig.REACT_APP_API_BASE_URL);

  const [formData, setFormData] = useState({
    userID: currentUser.UserID,
    departmentName: "",
    attractionName: "",
    reasonForRequest: "",
    submissionDate: new Date(),
    completionDate: new Date(),
    maintenanceStatus: "Completed",
    estimatedCost: "",
    StateID: "",
    RequestID: "",
  });

  useEffect(() => {
    const fetchMaintenanceIDs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseURL}/fetchmaintenanceinfo`);
        if (!response.ok) {
          throw new Error("Error retrieving maintenance info");
        }
        const data = await response.json();

        const highestStateData = data.reduce((acc, item) => {
          const existing = acc[item.RequestID];
          if (!existing || existing.StateID < item.StateID) {
            acc[item.RequestID] = item;
          }
          return acc;
        }, {});

        const nonCompletedData = Object.values(highestStateData).filter(
          (item) => item.MaintenanceStatus !== "Completed"
        );

        setRequestsData(nonCompletedData);
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
      }
      setIsLoading(false);
    };

    fetchMaintenanceIDs();
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.cursor = "wait";
    } else {
      document.body.style.cursor = "default";
    }
  }, [isLoading]);

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const handleSelectChange = (event) => {
    const [requestId, stateId] = event.target.value.split("_").map(Number);
    console.log("Selected Request ID:", requestId, "State ID:", stateId);
    const selectedRequestData = requestsData.find(
      (item) => item.RequestID === requestId && item.StateID === stateId
    );

    if (selectedRequestData) {
      const submissionDate = new Date(selectedRequestData.Date);
      const completionDate = new Date(selectedRequestData.DateCompleted);
      setSelectedRequest(requestId);
      setFormData({
        userID: currentUser.UserID,
        departmentName: selectedRequestData.DepName || "",
        attractionName: selectedRequestData.NameOfAttraction || "",
        reasonForRequest: selectedRequestData.DescriptionOfRequest || "",
        submissionDate: isValidDate(submissionDate)
          ? submissionDate
          : new Date(),
        completionDate: isValidDate(completionDate)
          ? completionDate
          : new Date(),
        maintenanceStatus: selectedRequestData.MaintenanceStatus || "",
        estimatedCost: selectedRequestData.Expense || "",
        StateID: selectedRequestData.StateID,
        RequestID: selectedRequestData.RequestID,
      });
    } else {
      console.error("No matching request data found.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "estimatedCost") {
      setCostChangedByUser(true);

      if (Number(value) > 5000) {
        setErrorMessage(
          "Cost Exceeds $5000, please update the price using Update Maintenance Request"
        );
      } else {
        setErrorMessage("");
      }
    }
  };

  const requestIDs = requestsData.map((item) => item.RequestID);

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    setErrorMessage("");
    const { submissionDate, completionDate, ...restOfFormData } = formData;

    const updatedFormData = {
      ...restOfFormData,
      submissionDate: submissionDate.toISOString().split("T")[0],
      completionDate: completionDate.toISOString().split("T")[0],
    };

    console.log("Submitting:", updatedFormData);

    try {
      const response = await fetch(`${baseURL}/completemaintenancerequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Request updated successfully:", responseData);

        Swal.fire({
          title: "Success!",
          text: responseData.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.value && onSuccess) {
            onSuccess();
          }
        });
      } else {
        const responseData = await response.json();
        const message = responseData.message || "Failed to update request.";
        setErrorMessage(message);
        console.error("Failed to update request:", message);
        return;
      }
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
    }
    setIsLoading(false);
  };

  const BackButtonClick = () => {
    setCostChangedByUser(false);
    setSelectedRequest("");
  };

  if (selectedRequest) {
    return (
      <div className="row justify-content-center">
        <div className="col md-4 mb-4">
          <div className="card MaintReq">
            <div className="card-body">
              <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
                Complete Maintenance Request {selectedRequest}
              </h1>
              <>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-2">
                        <label
                          htmlFor="userID"
                          className="form-label"
                          style={{
                            color: "#2F4858",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          Employee ID*
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Numeric ID assigned to each employee"
                          aria-label="Numeric ID assigned to each employee"
                          value={currentUser.UserID}
                          onChange={handleChange}
                          readOnly
                        ></input>
                      </div>

                      <div className="mb-2">
                        <label
                          htmlFor="departmentName"
                          className="form-label"
                          style={{
                            color: "#2F4858",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          Department Name*
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="departmentName"
                          placeholder="Name of Department"
                          aria-label="Name of Department"
                          value={formData.departmentName}
                          onChange={handleChange}
                          readOnly
                        ></input>
                      </div>

                      <div className="mb-2">
                        <label
                          htmlFor="attractionName"
                          className="form-label"
                          style={{
                            color: "#2F4858",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          Attraction Name*
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="attractionName"
                          placeholder="Name of Attraction"
                          aria-label="Name of Attraction"
                          value={formData.attractionName}
                          onChange={handleChange}
                          readOnly
                        ></input>
                      </div>

                      <div className="mb-2">
                        <label
                          htmlFor="reasonForRequest"
                          className="form-label"
                          style={{
                            color: "#2F4858",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          Reason for Request*
                        </label>
                        <div className="mb-3">
                          <textarea
                            className="form-control"
                            name="reasonForRequest"
                            rows="3"
                            value={formData.reasonForRequest}
                            onChange={handleChange}
                            readOnly
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-0">
                        <label
                          htmlFor="datePicker"
                          className="form-label"
                          style={{
                            color: "#2F4858",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          Date Submitted*
                        </label>
                      </div>
                      <div>
                        <div style={{ marginBottom: "10px" }}>
                          <DatePicker
                            selected={
                              isValidDate(new Date(formData.submissionDate))
                                ? new Date(formData.submissionDate)
                                : new Date()
                            }
                            onChange={(date) =>
                              setFormData({ ...formData, submissionDate: date })
                            }
                            className="form-control"
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="mb-0">
                        <label
                          htmlFor="datePicker"
                          className="form-label"
                          style={{
                            color: "#2F4858",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          Completion Date*
                        </label>
                      </div>
                      <div>
                        <div style={{ marginBottom: "10px" }}>
                          <DatePicker
                            selected={
                              isValidDate(new Date(formData.completionDate))
                                ? new Date(formData.completionDate)
                                : new Date()
                            }
                            onChange={(date) =>
                              setFormData({ ...formData, completionDate: date })
                            }
                            className="form-control"
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            readOnly
                          />
                        </div>

                        <div className="mb-2">
                          <label
                            htmlFor="attractionID"
                            className="form-label"
                            style={{
                              color: "#2F4858",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            Maintenance Status*
                          </label>
                          <div style={{ marginBottom: "10px" }}>
                            <select
                              className="form-select"
                              name="maintenanceStatus"
                              aria-label="Maintenance Status"
                              value={formData.maintenanceStatus}
                              onChange={handleChange}
                              disabled={true}
                              required
                            >
                              <option value="Completed">Completed</option>
                            </select>
                          </div>

                          <div className="mb-2">
                            <label
                              htmlFor="attractionID"
                              className="form-label"
                              style={{
                                color: "#2F4858",
                                fontSize: "18px",
                                fontWeight: "bold",
                              }}
                            >
                              Final Cost of Maintenance*
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="estimatedCost"
                              placeholder="$"
                              aria-label="$"
                              value={formData.estimatedCost}
                              onChange={handleChange}
                              required
                            ></input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <div className="d-grid gap-2 col-6 mx-auto">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={
                        costChangedByUser &&
                        Number(formData.estimatedCost) > 5000
                      }
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-link"
                      style={{ textDecoration: "underline", color: "blue" }}
                      onClick={BackButtonClick}
                    >
                      Back
                    </button>
                  </div>
                </form>
              </>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col md-4 mb-4">
        <div className="card MaintReqUp">
          <div className="card-body">
            <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
              Select Request to Complete
            </h1>
            <label
              htmlFor="userID"
              className="form-label"
              style={{
                color: "#2F4858",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Request ID*
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              value={selectedRequest}
              onChange={handleSelectChange}
            >
              <option defaultValue="">Select Maintenance ID to Complete</option>
              {requestsData.map((item) => (
                <option
                  key={`${item.RequestID}_${item.StateID}`}
                  value={`${item.RequestID}_${item.StateID}`}
                >
                  {`Request ID: ${item.RequestID} - State ID: ${item.StateID}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
