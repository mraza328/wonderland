import React, { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";

export default function RideDataReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRide, setSelectedRide] = useState("All");
  const [rideData, setRideData] = useState([]);
  const [totalRiders, setTotalRiders] = useState(0);

  const handleGenerateReport = () => {
    // Perform data fetching based on startDate, endDate, and selectedRide
    // Replace this with your actual data fetching logic
    const fetchedData = [
      { date: "2024-03-10", ride: "Roller Coaster", riders: 150 },
      { date: "2024-03-10", ride: "Ferris Wheel", riders: 80 },
      { date: "2024-03-11", ride: "Carousel", riders: 120 },
      { date: "2024-03-12", ride: "Water Slide", riders: 200 },
    ];

    // Filter fetched data based on date range and selectedRide
    let filteredData = fetchedData.filter(
      (entry) => entry.date >= startDate && entry.date <= endDate
    );

    if (selectedRide !== "All") {
      filteredData = filteredData.filter(
        (entry) => entry.ride === selectedRide
      );
    }

    // Sum up total riders
    const total = filteredData.reduce((acc, curr) => acc + curr.riders, 0);
    setTotalRiders(total);

    // Set ride data
    setRideData(filteredData);
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
            <option value="Roller Coaster">Roller Coaster</option>
            <option value="Ferris Wheel">Ferris Wheel</option>
            <option value="Carousel">Carousel</option>
            <option value="Water Slide">Water Slide</option>
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
              <td>{entry.date}</td>
              <td>{entry.ride}</td>
              <td>{entry.riders}</td>
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
