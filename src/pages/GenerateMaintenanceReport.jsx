import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export default function MaintenanceDataReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [maintenanceFilter, setMaintenanceFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [attractionFilter, setAttractionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [costFilter, setCostFilter] = useState("");
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [maintenanceOptions, setMaintenanceOptions] = useState([]);
  const [attractionOptions, setAttractionOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [displayedMaintenanceData, setDisplayedMaintenanceData] = useState([]);

  const costOptions = [
    "$0-$500",
    "$500-$1000",
    "$1000-$1500",
    "$1500-$2000",
    "$2000-2500",
    "$2500-5000",
    "$5000-10000",
    "$10000-20000",
    "$20000-40000",
    "$50000-100000",
    "$100000+",
  ];

  const handleClearForm = () => {
    setStartDate("");
    setEndDate("");
    setFilterBy("all");
    setMaintenanceFilter("");
    setEmployeeFilter("");
    setAttractionFilter("");
    setStatusFilter("");
    setCostFilter("");
    setTotalCost(0);
    setDisplayedMaintenanceData([]);
  };

  const handleGenerateReport = () => {
    let filteredData = maintenanceData.filter((item) => {
      const isStartDateMatch = startDate
        ? new Date(item.submissionDate) >= new Date(startDate)
        : true;
      const isEndDateMatch = endDate
        ? new Date(item.completionDate) <= new Date(endDate)
        : true;
      const isMaintenanceIdMatch = maintenanceFilter
        ? item.maintenanceIds.toString() === maintenanceFilter
        : true;
      const isEmployeeIdMatch = employeeFilter
        ? item.employeeIds.toString() === employeeFilter
        : true;
      const isAttractionNameMatch = attractionFilter
        ? item.attractionNames === attractionFilter
        : true;
      const isStatusMatch = statusFilter ? item.status === statusFilter : true;
      const isCostMatch = costFilter
        ? (() => {
            let minCost, maxCost;
            if (costFilter.includes("+")) {
              minCost = parseFloat(costFilter.replace(/\D/g, ""));
              maxCost = Infinity;
            } else {
              let parts = costFilter
                .split("-")
                .map((part) => parseFloat(part.replace(/\D/g, "")));
              [minCost, maxCost] =
                parts.length === 2 ? parts : [parseFloat(parts[0]), Infinity];
            }

            const cost = parseFloat(item.totalCost);
            return cost >= minCost && cost <= maxCost;
          })()
        : true;

      return (
        isStartDateMatch &&
        isEndDateMatch &&
        isMaintenanceIdMatch &&
        isEmployeeIdMatch &&
        isAttractionNameMatch &&
        isStatusMatch &&
        isCostMatch
      );
    });

    setDisplayedMaintenanceData(filteredData);
    const total = filteredData.reduce((acc, curr) => acc + curr.totalCost, 0);
    setTotalCost(total);
  };

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const response = await fetch("http://localhost:3001/maintenanceInfo");
        const data = await response.json();
        const transformedData = data.map((item) => ({
          maintenanceIds: item.RequestID,
          employeeIds: item.UserID,
          attractionNames: item.NameOfAttraction,
          startDate: item.Date,
          endDate: item.DateCompleted,
          status: item.MaintenanceStatus,
          totalCost: item.Expense || 0,
          reason: item.DescriptionOfRequest || "No reason provided",
          stateId: item.StateID,
        }));

        setMaintenanceData(transformedData);

        setEmployeeOptions(
          Array.from(new Set(transformedData.map((item) => item.employeeIds)))
        );
        setMaintenanceOptions(
          Array.from(
            new Set(transformedData.map((item) => item.maintenanceIds))
          )
        );
        setAttractionOptions(
          Array.from(
            new Set(transformedData.map((item) => item.attractionNames))
          )
        );
        setStatusOptions(
          Array.from(new Set(transformedData.map((item) => item.status)))
        );
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
      }
    };

    fetchMaintenanceData();
  }, []);

  return (
    <div className="maintenance-report-container">
      <h1>Maintenance Data Report Page</h1>
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
        <Form.Group controlId="FilterBy" className="mb-3">
          <Form.Label>Filter By</Form.Label>
          <Form.Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Maintenance ID">Maintenance ID</option>
            <option value="Employee ID">Employee ID</option>
            <option value="Attraction Name">Attraction Name</option>
            <option value="Status">Status</option>
            <option value="Cost of Maintenance">Cost of Maintenance</option>
          </Form.Select>
        </Form.Group>

        {filterBy === "Maintenance ID" && (
          <Form.Group controlId="MaintenanceFilter" className="mb-3">
            <Form.Label>Maintenance ID</Form.Label>
            <Form.Select
              value={maintenanceFilter}
              onChange={(e) => {
                setMaintenanceFilter(e.target.value);
                setEmployeeFilter("");
                setAttractionFilter("");
                setStatusFilter("");
              }}
            >
              <option value="">Select Maintenance ID</option>
              {maintenanceOptions.length > 0 ? (
                maintenanceOptions.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))
              ) : (
                <option disabled>Loading options...</option>
              )}
            </Form.Select>
          </Form.Group>
        )}

        {filterBy === "Employee ID" && (
          <Form.Group controlId="EmployeeFilter" className="mb-3">
            <Form.Label>Employee ID</Form.Label>
            <Form.Select
              value={employeeFilter}
              onChange={(e) => {
                setEmployeeFilter(e.target.value);
                setMaintenanceFilter("");
                setAttractionFilter("");
                setStatusFilter("");
              }}
            >
              <option value="">Select Employee ID</option>
              {employeeOptions.length > 0 ? (
                employeeOptions.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))
              ) : (
                <option disabled>Loading options...</option>
              )}
            </Form.Select>
          </Form.Group>
        )}

        {filterBy === "Attraction Name" && (
          <Form.Group controlId="AttractionFilter" className="mb-3">
            <Form.Label>Attraction ID</Form.Label>
            <Form.Select
              value={attractionFilter}
              onChange={(e) => {
                setAttractionFilter(e.target.value);
                setMaintenanceFilter("");
                setEmployeeFilter("");
                setStatusFilter("");
              }}
            >
              <option value="">Select Attraction ID</option>
              {attractionOptions.length > 0 ? (
                attractionOptions.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))
              ) : (
                <option disabled>Loading options...</option>
              )}
            </Form.Select>
          </Form.Group>
        )}

        {filterBy === "Status" && (
          <Form.Group controlId="StatusFilter" className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setMaintenanceFilter("");
                setEmployeeFilter("");
                setAttractionFilter("");
              }}
            >
              <option value="">Select Status</option>
              {statusOptions.length > 0 ? (
                statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))
              ) : (
                <option disabled>Loading options...</option>
              )}
            </Form.Select>
          </Form.Group>
        )}

        {filterBy === "Cost of Maintenance" && (
          <Form.Group controlId="CostFilter" className="mb-3">
            <Form.Label>Cost Range</Form.Label>
            <Form.Select
              value={costFilter}
              onChange={(e) => {
                setCostFilter(e.target.value);
                setMaintenanceFilter("");
                setEmployeeFilter("");
                setAttractionFilter("");
                setStatusFilter("");
              }}
            >
              <option value="">Select Cost Range</option>
              {costOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <div className="d-flex justify-content-between">
          <Button
            variant="primary"
            onClick={handleGenerateReport}
            className="mb-3"
          >
            Generate Report
          </Button>
          <Button
            variant="link"
            onClick={handleClearForm}
            className="mb-3"
            style={{ textDecoration: "underline", color: "blue" }}
          >
            Clear Form
          </Button>
        </div>
      </Form>
      <hr />
      <h2>Report</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Maintenance ID</th>
            <th>State ID</th>
            <th>Employee ID</th>
            <th>Attraction Name</th>
            <th>Start Date</th>
            <th>Completion Date</th>
            <th>Status</th>
            <th>Cost</th>
            <th>Reason for Request</th>
          </tr>
        </thead>
        <tbody>
          {displayedMaintenanceData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.maintenanceIds}</td>
              <td>{entry.stateId}</td>
              <td>{entry.employeeIds}</td>
              <td>{entry.attractionNames}</td>
              <td>{entry.startDate}</td>
              <td>{entry.endDate}</td>
              <td>{entry.status}</td>
              <td>${entry.totalCost.toFixed(2)}</td>
              <td>{entry.reason}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="6">
              <b>Total</b>
            </td>
            <td>
              <b>${totalCost.toFixed(2)}</b>
            </td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
