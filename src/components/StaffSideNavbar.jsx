import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StaffSideNavbar = ({ onItemClick }) => {
  const [isDataReportsOpen, setIsDataReportsOpen] = useState(false);
  const [isDataEntryFormsOpen, setIsDataEntryFormsOpen] = useState(false);
  const [isMaintenanceReportsOpen, setIsMaintenanceReportsOpen] =
    useState(false);

  const { currentUser } = useAuth();
  const role = currentUser?.Position;

  const toggleDataReportsDropdown = () => {
    setIsDataReportsOpen(!isDataReportsOpen);
  };

  const toggleDataEntryFormsDropdown = () => {
    setIsDataEntryFormsOpen(!isDataEntryFormsOpen);
  };

  const toggleMaintenanceReportsDropdown = () => {
    setIsMaintenanceReportsOpen(!isMaintenanceReportsOpen);
  };

  return (
    <div className="sidebar">
      <ul className="list-group">
        <li
          className="list-group-item"
          onClick={() => onItemClick("Dashboard")}
        >
          Dashboard
        </li>

        <li
          className="list-group-item"
          onClick={() => onItemClick("Purchase Tickets")}
        >
          Purchase Tickets
        </li>

        {(role === "Admin" ||
          role === "Department Manager" ||
          role === "Park Manager") && (
          <li
            className={`list-group-item ${
              isDataEntryFormsOpen ? "active" : ""
            }`}
            onClick={toggleDataEntryFormsDropdown}
          >
            Department Management
            {isDataEntryFormsOpen && (
              <ul className="list-group-submenu">
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Create Employee Account")}
                >
                  Add Employee
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Update Employee Data Entry Form")}
                >
                  Update Employee
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Delete Employee Data Entry Form")}
                >
                  Delete Employee
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Add Attraction Data Entry Form")}
                >
                  Add Attraction
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() =>
                    onItemClick("Update Attraction Data Entry Form")
                  }
                >
                  Update Attraction
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() =>
                    onItemClick("Delete Attraction Data Entry Form")
                  }
                >
                  Delete Attraction
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Add Vendor Data Entry Form")}
                >
                  Add Vendor
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Update Vendor Data Entry Form")}
                >
                  Update Vendor
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Delete Vendor Data Entry Form")}
                >
                  Delete Vendor
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() =>
                    onItemClick("Add Attraction Log Data Entry Form")
                  }
                >
                  Add to Attraction Log
                </li>

                {(role === "Admin" || role === "Park Manager") && (
                  <>
                    <li
                      className="list-group-submenu-item"
                      onClick={() =>
                        onItemClick("Add Weather Log Data Entry Form")
                      }
                    >
                      Shut Down Park
                    </li>
                    <li
                      className="list-group-submenu-item"
                      onClick={() =>
                        onItemClick("Add Department Data Entry Form")
                      }
                    >
                      Add Department
                    </li>
                    <li
                      className="list-group-submenu-item"
                      onClick={() =>
                        onItemClick("Update Department Data Entry Form")
                      }
                    >
                      Update Department
                    </li>
                  </>
                )}

                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Add Product Data Entry Form")}
                >
                  Add Product
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Update Product Data Entry Form")}
                >
                  Update Product
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Delete Product Data Entry Form")}
                >
                  Delete Product
                </li>
              </ul>
            )}
          </li>
        )}

        {(role === "Admin" || role === "Park Manager") && (
          <li
            className={`list-group-item ${isDataReportsOpen ? "active" : ""}`}
            onClick={toggleDataReportsDropdown}
          >
            Data Reports
            {isDataReportsOpen && (
              <ul className="list-group-submenu">
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Ticket Data Reports")}
                >
                  Ticket Reports
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Ride Data Reports")}
                >
                  Ride Reports
                </li>
                <li
                  className="list-group-submenu-item"
                  onClick={() => onItemClick("Revenue Data Reports")}
                >
                  Revenue Reports
                </li>
              </ul>
            )}
          </li>
        )}
        <li
          className={`list-group-item ${
            isMaintenanceReportsOpen ? "active" : ""
          }`}
          onClick={toggleMaintenanceReportsDropdown}
        >
          Maintenance Reports
          {isMaintenanceReportsOpen && (
            <ul className="list-group-submenu">
              <li
                className="list-group-submenu-item"
                onClick={() => onItemClick("Create New Maintenance Request")}
              >
                Create New Request
              </li>
              {(role === "Admin" ||
                role === "Department Manager" ||
                role === "Maintenance") && (
                <>
                  <li
                    className="list-group-submenu-item"
                    onClick={() =>
                      onItemClick("Edit Existing Maintenance Request")
                    }
                  >
                    Update Existing Request
                  </li>
                  <li
                    className="list-group-submenu-item"
                    onClick={() =>
                      onItemClick("Complete Existing Maintenance Request")
                    }
                  >
                    Complete Existing Request
                  </li>
                </>
              )}
              {(role === "Admin" ||
                role === "Department Manager" ||
                role === "Park Manager") && (
                <>
                  <li
                    className="list-group-submenu-item"
                    onClick={() => onItemClick("Maintenance Reporting Portal")}
                  >
                    Maintenance Reporting Portal
                  </li>
                </>
              )}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default StaffSideNavbar;
