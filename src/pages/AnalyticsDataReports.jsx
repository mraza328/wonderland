import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { currentConfig } from "../config";

export default function RideDataReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRideAttraction, setSelectedRideAttraction] = useState("All");
  const [selectedAttractionType, setSelectedAttractionType] = useState("All");
  const [selectedAnalyticsType, setSelectedAnalyticsType] =
    useState("Attractions");
  const [rideData, setRideData] = useState([]);
  const [totalRiders, setTotalRiders] = useState(0);
  const [attractions, setAttractions] = useState([]);
  const [showAttractionTypeSelect, setShowAttractionTypeSelect] =
    useState(false);
  const [peakActivity, setPeakActivity] = useState(null);
  const [leastPopularDay, setLeastPopularDay] = useState(null);
  const [mostPopularRide, setMostPopularRide] = useState(null);
  const [mostPopularRidePercentage, setMostPopularRidePercentage] =
    useState(null);

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
      console.log("Attractions Data:", attractionsData);
      setAttractions(attractionsData);
    } catch (error) {
      console.error("Error fetching attractions data:", error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`${baseURL}/analyticsreport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          selectedRide: selectedRideAttraction,
          selectedAttractionType,
          selectedAnalyticsType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      const data = await response.json();
      setRideData(data.reportData);
      setTotalRiders(data.totalRiders);
      setPeakActivity(data.peakActivity);
      setLeastPopularDay(data.leastPopularDay);
      setMostPopularRide(data.mostPopularRide);
      setMostPopularRidePercentage(data.mostPopularRidePercentage);
      console.log("Set Data:", data);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  useEffect(() => {
    setShowAttractionTypeSelect(selectedRideAttraction === "All");
  }, [selectedRideAttraction]);

  return (
    <div className="ride-report-container">
      <h1>Attraction Analytics Data Report Page</h1>
      <Form className="mt-3">
        <Form.Group controlId="startDate" className="mb-3">
          <Form.Label>Report Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="endDate" className="mb-3">
          <Form.Label>Report End Date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="selectedAnalyticsType" className="mb-3">
          <Form.Label>Select Analytics To Report</Form.Label>
          <Form.Select
            value={selectedAnalyticsType}
            onChange={(e) => setSelectedAnalyticsType(e.target.value)}
          >
            <option value="Attractions">Attractions</option>
          </Form.Select>
        </Form.Group>
        {selectedAnalyticsType === "Attractions" && (
          <>
            <Form.Group controlId="selectedRideAttraction" className="mb-3">
              <Form.Label>Select Ride</Form.Label>
              <Form.Select
                value={selectedRideAttraction}
                onChange={(e) => setSelectedRideAttraction(e.target.value)}
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
            {showAttractionTypeSelect && (
              <Form.Group controlId="selectedAttractionType" className="mb-3">
                <Form.Label>Select Attraction Type</Form.Label>
                <Form.Select
                  value={selectedAttractionType}
                  onChange={(e) => setSelectedAttractionType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Ride">Ride</option>
                  <option value="Show">Show</option>
                </Form.Select>
              </Form.Group>
            )}
          </>
        )}
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
      {selectedAnalyticsType === "Attractions" && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Ride</th>
              <th>Attraction Type</th>
              <th>Riders</th>
            </tr>
          </thead>
          <tbody>
            {rideData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.Date}</td>
                <td>{entry.NameOfAttraction}</td>
                <td>{entry.AttractionType}</td>
                <td>{parseInt(entry.TotalRiders)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3">
                <b>
                  Total "{selectedRideAttraction}" Visits for Specified Date
                  Range
                </b>
              </td>
              <td>
                <b>{totalRiders}</b>
              </td>
            </tr>
            {selectedAttractionType === "All" &&
              selectedRideAttraction === "All" &&
              peakActivity && (
                <tr>
                  <td colSpan="3">
                    <b>Peak Attraction Activity</b>
                  </td>
                  <td>
                    <b>{peakActivity[0].PeakDate}</b> (Visitors:{" "}
                    <b>{peakActivity[0].PeakVisitors}</b>)
                  </td>
                </tr>
              )}
            {selectedAttractionType === "All" &&
              selectedRideAttraction === "All" &&
              leastPopularDay && (
                <tr>
                  <td colSpan="3">
                    <b>Least Attraction Activity</b>
                  </td>
                  <td>
                    <b>{leastPopularDay[0].LeastPopularDate}</b> (Visitors:{" "}
                    <b>{leastPopularDay[0].LeastVisitors}</b>)
                  </td>
                </tr>
              )}
            {selectedAttractionType === "All" &&
              selectedRideAttraction === "All" &&
              mostPopularRide && (
                <tr>
                  <td colSpan="3">
                    <b>Most Popular Ride</b>
                  </td>
                  <td>
                    <b>{mostPopularRide[0].NameOfAttraction}</b> (Total Riders:{" "}
                    <b>{mostPopularRide[0].TotalRiders}</b>)
                  </td>
                </tr>
              )}
            {selectedAttractionType === "All" &&
              selectedRideAttraction === "All" &&
              mostPopularRidePercentage !== null && (
                <tr>
                  <td colSpan="3">
                    <b>Most Popular Ride Percentage</b>
                  </td>
                  <td>
                    <b>{mostPopularRidePercentage.toFixed(2)}%</b>
                  </td>
                </tr>
              )}
          </tbody>
        </Table>
      )}
    </div>
  );
}
