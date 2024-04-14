import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { currentConfig } from "../config";

export default function RideDataReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRide, setSelectedRide] = useState("All");
  const [rideData, setRideData] = useState([]);
  const [totalRiders, setTotalRiders] = useState(0);
  const [attractions, setAttractions] = useState([]);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    try {
      const response = await fetch(`${baseURL}/getallattractions`);
      if (!response.ok) {
        throw new Error("Failed to fetch attractions data");
      }
      const attractionsData = await response.json();
      setAttractions(attractionsData);
    } catch (error) {
      console.error("Error fetching attractions data:", error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`${baseURL}/ridereport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          selectedRide,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      const data = await response.json();
      setRideData(data.rideData);
      setTotalRiders(data.totalRiders);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="ride-report-container">
      <h1>Ride Data Report Page</h1>
      <Form className="mt-3">
        <Form.Group controlId="startDate" className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="endDate" className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="selectedRide" className="mb-3">
          <Form.Label>Select Ride</Form.Label>
          <Form.Select
            value={selectedRide}
            onChange={(e) => setSelectedRide(e.target.value)}
          >
            <option value="All">All Rides</option>
            {attractions.map((attraction) => (
              <option
                key={attraction.AttractionID}
                value={attraction.NameOfAttraction}
              >
                {attraction.NameOfAttraction}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button
          variant="primary"
          onClick={handleGenerateReport}
          className="mb-3"
        >
          Generate Report
        </Button>
      </Form>
      <hr />
      <h2>Report</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Ride</th>
            <th>Riders</th>
          </tr>
        </thead>
        <tbody>
          {rideData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.Date}</td>
              <td>{entry.NameOfAttraction}</td>
              <td>{parseInt(entry.TotalRiders)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="2">
              <b>Total</b>
            </td>
            <td>
              <b>{totalRiders}</b>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
