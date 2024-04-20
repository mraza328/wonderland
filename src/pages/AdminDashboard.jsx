import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Table } from "react-bootstrap";
import { currentConfig } from "../config";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const role = currentUser?.Position;
  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    position: "",
    employeeID: "",
    contactInformation: "",
    Supervisor: "",
    Salary: "",
    Address: "",
    Department: "",
    Schedule: "",
    DateOfBirth: "",
  });

  useEffect(() => {
    if (currentUser) {
      const formattedDateOfBirth = currentUser.DateOfBirth.split("T")[0];
      setPersonalInfo({
        name: `${currentUser.FirstName} ${currentUser.LastName}`,
        position: `${currentUser.Position}`,
        employeeID: `${currentUser.UserID}`,
        contactInformation: `${currentUser.Email} | ${currentUser.PhoneNumber}`,
        Supervisor: `${currentUser.Supervisor}`,
        Salary: `${currentUser.Salary}`,
        Address: `${currentUser.Address}`,
        Department: `${currentUser.Department}`,
        Schedule: "",
        DateOfBirth: formattedDateOfBirth,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchMaintenanceRequests() {
      try {
        const response = await fetch(`${baseURL}/fetchpendingmaintreq`);
        const data = await response.json();
        setMaintenanceRequests(data);
      } catch (error) {
        console.error("Failed to fetch maintenance requests", error);
      }
    }

    fetchMaintenanceRequests();
  }, []);

  console.log(maintenanceRequests);

  const feedback = "Remember to greet park visitors with a smile on your face.";

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const workHours = "9:00 AM - 7:00 PM";
  const wedWorkHoursFirstShift = "9:00 AM - 2:00 PM";
  const wedWorkHoursSecondShift = "2:00 PM - 7:00 PM";

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const currentDayOfWeek = currentDate.getDay();

  const startingDayOfWeek = currentDayOfWeek === 0 ? 0 : currentDayOfWeek;

  const currentWeek = [];
  let day = currentDay - startingDayOfWeek;
  for (let i = 0; i < 7; i++) {
    currentWeek.push(day);
    day++;
  }

  return (
    <>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="personal-info">
          <h3>Personal Information</h3>
          <div className="row">
            <div className="col">
              <p>Name: {personalInfo.name}</p>
            </div>
            <div className="col">
              <p>Employee ID: {personalInfo.employeeID}</p>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p>Position: {personalInfo.position}</p>
            </div>
            <div className="col">
              <p>Department: {personalInfo.Department}</p>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p>Supervisor: {personalInfo.Supervisor}</p>
            </div>
            <div className="col">
              <p>Address: {personalInfo.Address}</p>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p>Date of Birth: {personalInfo.DateOfBirth}</p>
            </div>
            <div className="col">
              <p>Salary: {personalInfo.Salary}</p>
            </div>
          </div>
          <div className="row">
            <p>Contact Information: {personalInfo.contactInformation}</p>
          </div>
        </div>

        {(role === "Admin" ||
          role === "Department Manager" ||
          role === "Park Manager") && (
          <div className="maintenance-requests">
            <h3>Maintenance Pending Manager Approval</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Attraction Name</th>
                  <th>Status</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRequests.length > 0 ? (
                  maintenanceRequests.map((request, index) => (
                    <tr key={index}>
                      <td>{request.RequestID}</td>
                      <td>{request.NameOfAttraction}</td>
                      <td>{"Pending Approval"}</td>
                      <td>${request.Expense}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No pending requests</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        <div className="schedule-calendar">
          <h3>
            Work Schedule: {currentMonth} {currentYear}
          </h3>
          <div className="schedule-header">
            {daysOfWeek.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </div>
          <div className="schedule-week">
            {currentWeek.map((day, index) => (
              <div
                key={index}
                className={`schedule-day ${
                  day === currentDay ? "highlight" : ""
                }`}
              >
                <p>{day}</p>
                {personalInfo.Schedule === "First Shift" ? (
                  <p>
                    {index >= 0 && index <= 3
                      ? index !== 3
                        ? workHours
                        : wedWorkHoursFirstShift
                      : "Not Scheduled"}
                  </p>
                ) : (
                  <p>
                    {index >= 3 && index <= 6
                      ? index !== 3
                        ? workHours
                        : wedWorkHoursSecondShift
                      : "Not Scheduled"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="feedback">
          <h3>Feedback & Suggestions</h3>
          <p>{feedback}</p>
        </div>
      </div>
    </>
  );
}
