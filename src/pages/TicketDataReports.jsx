import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { currentConfig } from "../config";

export default function TicketDataReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerID, setCustomerID] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [totalGATickets, setTotalGATickets] = useState(0);
  const [totalKITickets, setTotalKITickets] = useState(0);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  const handleGenerateReport = async() => {
    // Perform data fetching based on startDate and endDate
    // Replace this with your actual data fetching logic
    if(customerID===" "){
      setCustomerID(null);
    }
    console.log(customerID);
    const formData = {customerID}
    const response = await fetch(`${baseURL}/ticketreports`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    console.log(json);

    if (!response.ok) {
      console.log("Failed to fetch ticket data");
    }
    if (response.ok) {
      setFetchedData(json);
    }
  };

  useEffect(() => {
    let filteredData = [...fetchedData]; // Create a separate copy of fetchedData
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);
    const startDateWithoutTime = new Date(
      startDateObject.getFullYear(),
      startDateObject.getMonth(),
      startDateObject.getDate() + 1
    );
    const endDateWithoutTime = new Date(
      endDateObject.getFullYear(),
      endDateObject.getMonth(),
      endDateObject.getDate() + 1
    );
    filteredData = filteredData.filter(
      (entry) =>
        new Date(entry.DateSold) >= new Date(startDateWithoutTime) &&
        new Date(entry.DateSold) <= new Date(endDateWithoutTime)
    );
  
    const totalGATicket = filteredData.reduce((acc, curr) => acc + parseInt(curr.GA_Tickets), 0);
    const totalKITicket = filteredData.reduce((acc, curr) => acc + parseInt(curr.KI_Tickets), 0);
    setTotalGATickets(totalGATicket);
    setTotalKITickets(totalKITicket);
  
    setTicketData(filteredData);
  }, [fetchedData]);

  return (
    <div className="ticket-report-container">
      <h1>Ticket Data Report Page</h1>
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
        <Form.Group controlId="ticketType" className="mb-3">
          <Form.Label>Customer ID</Form.Label>
          <Form.Control
            type="text"
            value={customerID}
            onChange={(e) => setCustomerID(e.target.value)}
            placeholder="Enter Customer ID"
          />
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
            <th>Date Sold</th>
            <th>Date Valid</th>
            <th>Name Of Customer</th>
            <th>General Admission Tickets Bought</th>
            <th>Kid Tickets Bought</th>
          </tr>
        </thead>
        <tbody>
          {ticketData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.DateSold.substring(0, 10)}</td>
              <td>{entry.DateValid.substring(0, 10)}</td>
              <td>{entry.FullName}</td>
              <td>{entry.GA_Tickets}</td>
              <td>{entry.KI_Tickets}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="4">
              <b>Total General Admission Tickets</b>
            </td>
            <td>
              <b>{totalGATickets}</b>
            </td>
          </tr>
          <tr>
            <td colSpan="4">
              <b>Total Kid Admission Tickets</b>
            </td>
            <td>
              <b>{totalKITickets}</b>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
