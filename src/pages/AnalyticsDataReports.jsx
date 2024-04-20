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
  const [selectedVendorType, setSelectedVendorType] = useState("All");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [vendorProducts, setVendorProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [vendorData, setVendorData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [mostPopularVendor, setMostPopularVendor] = useState(null);
  const [leastPopularVendor, setLeastPopularVendor] = useState(null);
  const [mostPopularProduct, setMostPopularProduct] = useState(null);
  const [leastPopularProduct, setLeastPopularProduct] = useState(null);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    setShowAttractionTypeSelect(selectedRideAttraction === "All");
  }, [selectedRideAttraction]);

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

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${baseURL}/getallvendors`);
      if (!response.ok) {
        throw new Error("Failed to fetch vendor data");
      }
      const vendorsData = await response.json();
      console.log("Vendors Data:", vendorsData);
      setVendors(vendorsData);
    } catch (error) {
      console.error("Error fetching vendors data:", error);
    }
  };

  useEffect(() => {
    fetchProductsByVendor();
  }, []);

  const fetchProductsByVendor = async () => {
    try {
      const response = await fetch(`${baseURL}/getallproducts`);
      if (!response.ok) {
        throw new Error("Failed to fetch vendor products data");
      }
      const vendorProductsData = await response.json();
      console.log("Vendor Products Data:", vendorProductsData);
      setVendorProducts(vendorProductsData);
    } catch (error) {
      console.error("Error fetching vendor products data:", error);
    }
  };

  const handleGenerateAttractionReport = async () => {
    try {
      const response = await fetch(`${baseURL}/attractionsanalyticsreport`, {
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

  const handleGenerateVendorReport = async () => {
    try {
      const response = await fetch(`${baseURL}/vendorsanalyticsreport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          selectedVendor,
          selectedVendorType,
          selectedProduct,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      const data = await response.json();
      setVendorData(data.reportData);
      setTotalSales(data.totalSales);
      console.log("Set Data:", data);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const calculateMetricsForAllVendors = () => {
    // Calculate most popular vendor
    const mostPopularVendor = vendorData.reduce((prev, current) =>
      parseFloat(prev.TotalSales) > parseFloat(current.TotalSales)
        ? prev
        : current
    );

    // Calculate least popular vendor
    const leastPopularVendor = vendorData.reduce((prev, current) =>
      parseFloat(prev.TotalSales) < parseFloat(current.TotalSales)
        ? prev
        : current
    );

    // Group by product name to calculate most and least popular products
    const productsGroupedByName = {};
    vendorData.forEach((entry) => {
      if (!productsGroupedByName[entry.ProductName]) {
        productsGroupedByName[entry.ProductName] = 0;
      }
      productsGroupedByName[entry.ProductName] += parseFloat(entry.TotalSales);
    });

    // Calculate most popular product
    const mostPopularProduct = Object.keys(productsGroupedByName).reduce(
      (prev, current) =>
        productsGroupedByName[prev] > productsGroupedByName[current]
          ? prev
          : current
    );

    // Calculate least popular product
    const leastPopularProduct = Object.keys(productsGroupedByName).reduce(
      (prev, current) =>
        productsGroupedByName[prev] < productsGroupedByName[current]
          ? prev
          : current
    );

    return {
      mostPopularVendor,
      leastPopularVendor,
      mostPopularProduct,
      leastPopularProduct,
    };
  };

  useEffect(() => {
    if (vendorData.length > 0) {
      const metrics = calculateMetricsForAllVendors();
      setMostPopularVendor(metrics.mostPopularVendor);
      setLeastPopularVendor(metrics.leastPopularVendor);
      setMostPopularProduct(metrics.mostPopularProduct);
      setLeastPopularProduct(metrics.leastPopularProduct);
    }
  }, [vendorData]);

  return (
    <div className="ride-report-container">
      <h1>Analytics Data Report Page</h1>
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
            <option value="Vendors">Vendors</option>
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
        {selectedAnalyticsType === "Vendors" && (
          <>
            <Form.Group controlId="selectedVendor" className="mb-3">
              <Form.Label>Select Vendor</Form.Label>
              <Form.Select
                value={selectedVendor}
                onChange={(e) => {
                  setSelectedVendor(e.target.value);
                  setSelectedProduct("All");
                }}
              >
                <option value="All">All Vendors</option>
                {vendors.map((vendor) => (
                  <option key={vendor.NameOfVendor} value={vendor.NameOfVendor}>
                    {vendor.NameOfVendor}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {selectedVendor === "All" && (
              <Form.Group controlId="selectedVendorType" className="mb-3">
                <Form.Label>Select Vendor Type</Form.Label>
                <Form.Select
                  value={selectedVendorType}
                  onChange={(e) => setSelectedVendorType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Food">Food</option>
                  <option value="Merchandise">Merchandise</option>
                </Form.Select>
              </Form.Group>
            )}
            {selectedVendor !== "All" && (
              <Form.Group controlId="selectedProduct" className="mb-3">
                <Form.Label>Select Product</Form.Label>
                <Form.Select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="All">All {selectedVendor} Products</option>
                  {vendorProducts
                    .filter(
                      (product) => product.NameOfVendor === selectedVendor
                    )
                    .map((product) => (
                      <option key={product.ItemID} value={product.ItemID}>
                        {product.NameOfItem}
                      </option>
                    ))}
                  {vendorProducts.filter(
                    (product) => product.NameOfVendor === selectedVendor
                  ).length === 0 && (
                    <option disabled>No products in vendor provided</option>
                  )}
                </Form.Select>
              </Form.Group>
            )}
          </>
        )}
        {selectedAnalyticsType === "Attractions" && (
          <Button
            variant="primary"
            onClick={handleGenerateAttractionReport}
            className="mb-3"
          >
            Generate Attraction Report
          </Button>
        )}
        {selectedAnalyticsType === "Vendors" && (
          <Button
            variant="primary"
            onClick={handleGenerateVendorReport}
            className="mb-3"
          >
            Generate Vendor Report
          </Button>
        )}
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
                  Total "{selectedRideAttraction}" Visits for Specified
                  Parameters
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
                    <b>Most Popular Day</b>
                  </td>
                  <td>
                    <b>{peakActivity[0].PeakDate}</b> (Riders:{" "}
                    <b>{peakActivity[0].PeakVisitors}</b>)
                  </td>
                </tr>
              )}
            {selectedAttractionType === "All" &&
              selectedRideAttraction === "All" &&
              leastPopularDay && (
                <tr>
                  <td colSpan="3">
                    <b>Least Popular Day</b>
                  </td>
                  <td>
                    <b>{leastPopularDay[0].LeastPopularDate}</b> (Riders:{" "}
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
      {selectedAnalyticsType === "Vendors" && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Vendor Name</th>
              <th>Vendor Type</th>
              <th>Product Name</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {vendorData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.Date}</td>
                <td>{entry.NameOfVendor}</td>
                <td>{entry.VendorType}</td>
                <td>{entry.ProductName}</td>
                <td>${entry.TotalSales}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="4">
                <b>Total "{selectedVendor}" Sales for Specified Parameters</b>
              </td>
              <td>
                <b>${totalSales}</b>
              </td>
            </tr>
          </tbody>
        </Table>
      )}
      {selectedAnalyticsType === "Vendors" &&
        selectedVendor === "All" &&
        selectedVendorType === "All" && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Vendor Name</th>
                  <th>Vendor Type</th>
                  <th>Product Name</th>
                  <th>Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {vendorData.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.Date}</td>
                    <td>{entry.NameOfVendor}</td>
                    <td>{entry.VendorType}</td>
                    <td>{entry.ProductName}</td>
                    <td>${entry.TotalSales}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="4">
                    <b>
                      Total "{selectedVendor}" Sales for Specified Parameters
                    </b>
                  </td>
                  <td>
                    <b>${totalSales}</b>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Metrics</th>
                  <th>Report Results</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Most Popular Vendor</td>
                  <td>
                    {mostPopularVendor ? mostPopularVendor.NameOfVendor : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td>Least Popular Vendor</td>
                  <td>
                    {leastPopularVendor
                      ? leastPopularVendor.NameOfVendor
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td>Most Popular Product</td>
                  <td>{mostPopularProduct || "N/A"}</td>
                </tr>
                <tr>
                  <td>Least Popular Product</td>
                  <td>{leastPopularProduct || "N/A"}</td>
                </tr>
              </tbody>
            </Table>
          </>
        )}
    </div>
  );
}
