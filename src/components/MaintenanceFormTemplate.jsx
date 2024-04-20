import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MaintenanceFormTemplate({ onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  // State for managing the date input
  const [SubmissionDate, setSubmissionDate] = useState(new Date());
  const [CompletionDate, setCompletionDate] = useState(new Date());

  return (
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
              ></input>
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
                Department ID*
              </label>
              <input
                className="form-control"
                type="int"
                placeholder="Numeric ID assigned to each department"
                aria-label="$"
              ></input>
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
                Attraction ID*
              </label>
              <input
                className="form-control"
                type="text"
                placeholder="Numeric ID assigned to each attraction"
                aria-label="Numeric ID assigned to each attraction"
              ></input>
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
                Reason for Request*
              </label>
              <div class="mb-3">
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
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
                    class="form-select"
                    aria-label="Default select example"
                  >
                    <option selected>Select Menu</option>
                    <option value="1">Pending</option>
                    <option value="2">Active</option>
                    <option value="3">Completed</option>
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
                    Total Cost of Maintenance*
                  </label>
                  <input
                    className="form-control"
                    type="float"
                    placeholder="$"
                    aria-label="$"
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2 col-6 mx-auto">
          <button class="btn btn-primary" type="button">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
