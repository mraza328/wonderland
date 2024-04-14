import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StaffSideNavbar from "../components/StaffSideNavbar";
import AdminDashboard from "./AdminDashboard";
import AdminDataReports from "./AdminDataReports";
import AdminDepManagement from "./AdminDepManagement";
import TicketDataReports from "./TicketDataReports";
import RideDataReports from "./RideDataReports";
import RevenueDataReports from "./RevenueDataReports";
import CreateEmployeeAccount from "./CreateEmployeeAccount";
import AddEmployee from "./AddEmployee";
import UpdateEmployee from "./UpdateEmployeeDataEntryForm";
import DeleteEmployee from "./DeleteEmployeeDataEntryForm";
import AddAttraction from "./AddAttractionDataEntryForm";
import UpdateAttraction from "./UpdateAttractionDataEntryForm";
import DeleteAttraction from "./DeleteAttractionDataEntryForm";
import AddVendor from "./AddVendorDataEntryForm";
import UpdateVendor from "./UpdateVendorDataEntryForm";
import DeleteVendor from "./DeleteVendorDataEntryForm";
import AddAttractionLog from "./AddAttractionLogDataEntryForm";
import AddWeatherLog from "./AddWeatherLogDataEntryForm";
import AddDepartment from "./AddDepartmentDataEntryForm.";
import UpdateDepartment from "./UpdateDepartmentDataEntryForm";
import AddProduct from "./AddProductDataEntryForm";
import UpdateProduct from "./UpdateProductDataEntryForm";
import DeleteProduct from "./DeleteProductDataEntryForm";
import StaffTicketPurchase from "./StaffTicketPurchase";
import MaintenanceRequestForm from "./MaintenanceRequestForm";
import MaintenanceUpReq from "./MaintenanceUpdateRequest";
import MaintenanceCompReq from "./MaintenanceCompleteRequest";
import GenerateMaintRep from "./GenerateMaintenanceReport";
import MaintReqManagerApproval from "./MaintReqManagerApproval";

const AdminLanding = () => {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [employeeData, setEmployeeData] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const acctType = currentUser?.AccountType;

  if (acctType == "Customer") {
    navigate("/");
  }

  const transitionToAddEmployee = (employeeData) => {
    console.log("Transitioning with data:", employeeData);
    setEmployeeData(employeeData);
    setSelectedPage("Add Employee");
  };

  const handleFormSubmissionSuccess = () => {
    setSelectedPage("Dashboard");
  };

  const handleItemClick = (pageName) => {
    setSelectedPage(pageName);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <StaffSideNavbar onItemClick={handleItemClick} />
        </div>
        {/* Main Content */}
        <div className="col-md-9">
          <div className="main-content">
            {/* Render the selected page */}
            {selectedPage === "Dashboard" && <AdminDashboard />}
            {selectedPage === "Department Management" && <AdminDepManagement />}
            {selectedPage === "Data Reports" && <AdminDataReports />}
            {selectedPage === "Ticket Data Reports" && <TicketDataReports />}
            {selectedPage === "Ride Data Reports" && <RideDataReports />}
            {selectedPage === "Revenue Data Reports" && <RevenueDataReports />}
            {selectedPage === "Create Employee Account" && (
              <CreateEmployeeAccount onSuccess={transitionToAddEmployee} />
            )}
            {selectedPage === "Add Employee" && (
              <AddEmployee
                employeeData={employeeData}
                onSuccess={handleFormSubmissionSuccess}
              />
            )}

            {selectedPage === "Update Employee Data Entry Form" && (
              <UpdateEmployee />
            )}
            {selectedPage === "Delete Employee Data Entry Form" && (
              <DeleteEmployee />
            )}
            {selectedPage === "Add Attraction Data Entry Form" && (
              <AddAttraction />
            )}
            {selectedPage === "Update Attraction Data Entry Form" && (
              <UpdateAttraction />
            )}
            {selectedPage === "Delete Attraction Data Entry Form" && (
              <DeleteAttraction />
            )}
            {selectedPage === "Add Vendor Data Entry Form" && <AddVendor />}
            {selectedPage === "Update Vendor Data Entry Form" && (
              <UpdateVendor />
            )}
            {selectedPage === "Delete Vendor Data Entry Form" && (
              <DeleteVendor />
            )}
            {selectedPage === "Add Attraction Log Data Entry Form" && (
              <AddAttractionLog />
            )}
            {selectedPage === "Add Weather Log Data Entry Form" && (
              <AddWeatherLog />
            )}
            {selectedPage === "Add Department Data Entry Form" && (
              <AddDepartment />
            )}
            {selectedPage === "Update Department Data Entry Form" && (
              <UpdateDepartment />
            )}
            {selectedPage === "Add Product Data Entry Form" && <AddProduct />}
            {selectedPage === "Update Product Data Entry Form" && (
              <UpdateProduct />
            )}
            {selectedPage === "Delete Product Data Entry Form" && (
              <DeleteProduct />
            )}
            {selectedPage === "Purchase Tickets" && <StaffTicketPurchase />}
            {selectedPage === "Create New Maintenance Request" && (
              <MaintenanceRequestForm onSuccess={handleFormSubmissionSuccess} />
            )}
            {selectedPage === "Edit Existing Maintenance Request" && (
              <MaintenanceUpReq onSuccess={handleFormSubmissionSuccess} />
            )}
            {selectedPage === "Complete Existing Maintenance Request" && (
              <MaintenanceCompReq onSuccess={handleFormSubmissionSuccess} />
            )}
            {selectedPage === "Maintenance Reporting Portal" && (
              <GenerateMaintRep />
            )}
            {selectedPage === "MaintReqManagerApproval" && (
              <MaintReqManagerApproval
                onSuccess={handleFormSubmissionSuccess}
              />
            )}
            {/* Add more pages as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLanding;
