import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";

export default function RevenueDataReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [revenueSource, setRevenueSource] = useState("All");
  const [ticketType, setTicketType] = useState("All");
  const [foodBundleType, setFoodBundleType] = useState("All"); // New state for Food bundle type
  const [merchBundleType, setMerchBundleType] = useState("All"); // New state for Merchandise bundle type
  const [fetchedData, setFetchedData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isSet, setIsSet] = useState(false);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/ticketPurchase");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        let newFoodObj = {NameOfItem: "All", VendorType: "Food" }
        let newMerchObj = {NameOfItem: "All", VendorType: "Merchandise" }
        data.unshift(newFoodObj);
        data.unshift(newMerchObj);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      const response = await fetch("http://localhost:3001/getRevenueReport", {
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
        setFetchedData(json);
        setIsSet(true);
      }
    };

    fetchRevenueData();
  }, []);

  const handleGenerateReport = () => {
    // Filter fetched data based on date range and revenue source
    let filteredData = [...fetchedData];
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
        new Date(entry.Date) >= new Date(startDateWithoutTime) &&
        new Date(entry.Date) <= new Date(endDateWithoutTime)
    );

    if (revenueSource !== "All") {
      filteredData = filteredData.filter(
        (entry) => entry.Source === revenueSource
      );
    }

    if (revenueSource === "Tickets" && ticketType !== "All") {
      filteredData = filteredData.filter((entry) => entry.Type === ticketType);
    } else if (revenueSource === "Food" && foodBundleType !== "All") {
      filteredData = filteredData.filter(
        (entry) => entry.Type === foodBundleType
      );
    } else if (revenueSource === "Merchandise" && merchBundleType !== "All") {
      filteredData = filteredData.filter(
        (entry) => entry.Type === merchBundleType
      );
    }

    // Calculate total revenue
    const total = filteredData.reduce((acc, curr) => acc + curr.Revenue, 0);
    setTotalRevenue(total);

    // Set revenue data
    setRevenueData(filteredData);
  };

  return (
    <div className="revenue-report-container">
      <h1>Revenue Data Report Page</h1>
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
        <Form.Group controlId="revenueSource" className="mb-3">
          <Form.Label>Revenue Source</Form.Label>
          <Form.Select
            value={revenueSource}
            onChange={(e) => setRevenueSource(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Tickets">Tickets</option>
            <option value="Food">Food</option>
            <option value="Merchandise">Merchandise</option>
          </Form.Select>
        </Form.Group>
        {revenueSource === "Tickets" && (
          <Form.Group controlId="ticketType" className="mb-3">
            <Form.Label>Ticket Type</Form.Label>
            <Form.Select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="GA">General Admission</option>
              <option value="KI">Kid Tickets</option>
            </Form.Select>
          </Form.Group>
        )}
        {revenueSource === "Food" && (
          <Form.Group controlId="foodBundleType" className="mb-3">
            <Form.Label>Food Bundle Type</Form.Label>
            <Form.Select
              value={foodBundleType}
              onChange={(e) => setFoodBundleType(e.target.value)}
            >
              {products
                .filter((product) => product.VendorType === "Food")
                .map((product) => (
                  <option key={product.ItemID} value={product.NameOfItem}>
                    {product.NameOfItem}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        )}
        {revenueSource === "Merchandise" && (
          <Form.Group controlId="merchBundleType" className="mb-3">
            <Form.Label>Merchandise Bundle Type</Form.Label>
            <Form.Select
              value={merchBundleType}
              onChange={(e) => setMerchBundleType(e.target.value)}
            >
              {products
                .filter((product) => product.VendorType === "Merchandise")
                .map((product) => (
                  <option key={product.ItemID} value={product.NameOfItem}>
                    {product.NameOfItem}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Revenue Source</th>
            <th>Revenue Type</th>
            <th>Revenue Amount</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.Date.substring(0, 10)}</td>
              <td>{entry.Source}</td>
              <td>{entry.Type}</td>
              <td>${entry.Revenue}</td>
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
