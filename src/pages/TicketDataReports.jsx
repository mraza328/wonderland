import React, { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";

export default function TicketDataReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ticketType, setTicketType] = useState("all");
  const [ticketData, setTicketData] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const handleGenerateReport = () => {
    // Perform data fetching based on startDate and endDate
    // Replace this with your actual data fetching logic
    const fetchedData = [
      { date: "2024-03-10", type: "GA", tickets: 15, price: 55 },
      { date: "2024-03-10", type: "KI", tickets: 5, price: 35 },
      { date: "2024-03-11", type: "KI", tickets: 20, price: 35 },
      { date: "2024-03-12", type: "GA", tickets: 18, price: 55 },
      { date: "2024-03-12", type: "KI", tickets: 8, price: 35 },
    ];

    // Filter fetched data based on ticketType
    let filteredData = [...fetchedData]; // Create a separate copy of fetchedData
    if (ticketType !== "all") {
      filteredData = fetchedData.filter((entry) => entry.type === ticketType);
    }

    // Generate an array of dates between startDate and endDate (inclusive)
    const dateRange = [];
    let currentDate = new Date(startDate);
    const endDateInclusive = new Date(endDate);
    endDateInclusive.setDate(endDateInclusive.getDate() + 1); // Include end date
    while (currentDate < endDateInclusive) {
      dateRange.push(currentDate.toISOString().slice(0, 10));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Initialize an array to hold the report data
    const flattenedData = [];

    // Create a Set to keep track of processed dates
    const processedDates = new Set();

    // Create separate entries for each date and ticket type
    dateRange.forEach((date) => {
      // Check if the date has already been processed
      if (!processedDates.has(date)) {
        // Process the data for this date
        let gaTickets = 0;
        let kiTickets = 0;
        let gaRevenue = 0;
        let kiRevenue = 0;
        filteredData.forEach((entry) => {
          if (entry.date === date) {
            if (entry.type === "GA") {
              gaTickets += entry.tickets;
              gaRevenue += entry.tickets * entry.price;
            } else if (entry.type === "KI") {
              kiTickets += entry.tickets;
              kiRevenue += entry.tickets * entry.price;
            }
          }
        });
        // Add the processed data to flattenedData
        if (gaTickets > 0) {
          flattenedData.push({
            date,
            type: "GA",
            tickets: gaTickets,
            revenue: gaRevenue,
          });
        }
        if (kiTickets > 0) {
          flattenedData.push({
            date,
            type: "KI",
            tickets: kiTickets,
            revenue: kiRevenue,
          });
        }
        // Add the date to the set of processed dates
        processedDates.add(date);
      }
    });

    // Set the total tickets and total revenue
    const totalTickets = flattenedData.reduce(
      (acc, curr) => acc + curr.tickets,
      0
    );
    const totalRevenue = flattenedData.reduce(
      (acc, curr) => acc + curr.revenue,
      0
    );
    setTotalTickets(totalTickets);
    setTotalRevenue(totalRevenue);

    setTicketData(flattenedData);
  };

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
          <Form.Label>Ticket Type</Form.Label>
          <Form.Select
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="GA">General Admission</option>
            <option value="KI">Kid Tickets</option>
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
            <th>Ticket Type</th>
            <th>Tickets Bought</th>
            <th>Ticket Revenue</th>
          </tr>
        </thead>
        <tbody>
          {ticketData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.type}</td>
              <td>{entry.tickets}</td>
              <td>${entry.revenue}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3">
              <b>Total</b>
            </td>
            <td>
              <b>${totalRevenue}</b>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
