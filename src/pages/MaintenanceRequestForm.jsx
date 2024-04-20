import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import { currentConfig } from "../config";
import Swal from "sweetalert2";

export default function MaintenanceRequestForm({ onSuccess }) {
  const { currentUser } = useAuth();
  const [SubmissionDate, setSubmissionDate] = useState(new Date());
  const [CompletionDate, setCompletionDate] = useState(new Date());
  const [responseMessage, setResponseMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [attractions, setAttractions] = useState([]);
  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await fetch(`${baseURL}/getallattractions`);
        const data = await response.json();
        setAttractions(data.map((attraction) => attraction.NameOfAttraction));
      } catch (error) {
        console.error("Failed to fetch attractions:", error);
      }
    };

    fetchAttractions();
  }, [baseURL]);

  const [formData, setFormData] = useState({
    userID: currentUser.UserID,
    departmentName: "Attraction",
    attractionName: "",
    reasonForRequest: "",
    submissionDate: SubmissionDate,
    completionDate: CompletionDate,
    maintenanceStatus: "Active",
    estimatedCost: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedFormData = {
      ...formData,
      submissionDate: SubmissionDate.toISOString().split("T")[0],
      completionDate: CompletionDate.toISOString().split("T")[0],
    };

    console.log("Submitting:", updatedFormData);

    try {
      const response = await fetch(`${baseURL}/newmaintenancerequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const responseData = await response.json();
      if (response.status === 200 || response.status === 201) {
        console.log("Request submitted successfully:", responseData);
        setResponseMessage(responseData.message);
        setMessageType("success");

        if (response.status === 200) {
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
        } else if (response.status === 201) {
          Swal.fire({
            title: "Pending!",
            text: responseData.message,
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.value && onSuccess) {
              onSuccess();
            }
          });
        }
      } else {
        console.error("Failed to add request:", responseData);
        setResponseMessage("Failed to add request.");
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
    }
  };

  return (
    <>
      <div className="row justify-content-center">
        <div className="col md-4 mb-4">
          <div className="card MaintReq">
            <div className="card-body">
              <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
                Create New Maintenance Request
              </h1>
              {responseMessage && (
                <div className={`alert alert-${messageType}`} role="alert">
                  {responseMessage}
                </div>
              )}
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
                        <select
                          className="form-select"
                          name="attractionName"
                          value={formData.attractionName}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Attraction</option>
                          {attractions.map((name, index) => (
                            <option key={index} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
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
                            required
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
                            selected={SubmissionDate}
                            onChange={(date) => setSubmissionDate(date)}
                            className="form-control"
                            dateFormat="MMMM d, yyyy"
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
                          Expected Completion Date*
                        </label>
                      </div>
                      <div>
                        <div style={{ marginBottom: "10px" }}>
                          <DatePicker
                            selected={CompletionDate}
                            onChange={(date) => setCompletionDate(date)}
                            className="form-control"
                            dateFormat="MMMM d, yyyy"
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
                              aria-label="Maintenance Status"
                              defaultValue=""
                              onChange={handleChange}
                            >
                              <option defaultValue>Select Menu</option>
                              <option value="Pending" disabled>
                                Pending
                              </option>
                              <option value="Active">Active</option>
                              <option value="Completed" disabled>
                                Completed
                              </option>
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
                              Estimated Cost of Maintenance*
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              name="estimatedCost"
                              placeholder="$"
                              aria-label="$"
                              value={formData.estimatedCost}
                              onChange={handleChange}
                            ></input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid gap-2 col-6 mx-auto">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
