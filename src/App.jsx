import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import ParkInformation from "./pages/ParkInformation";
import StaffSignIn from "./pages/StaffSignIn";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/signUp";
import UpdateAccount from "./pages/UpdateAccount";
import TicketPurchase from "./pages/TicketPurchase";

import AdminLanding from "./pages/AdminLanding";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDataReports from "./pages/AdminDataReports";
import AdminDepManagement from "./pages/AdminDepManagement";
import MaintenanceRequestForm from "./pages/MaintenanceRequestForm";
import MaintenanceUpReq from "./pages/MaintenanceUpdateRequest";
import MaintenanceCompReq from "./pages/MaintenanceCompleteRequest";
import GenerateMaintRep from "./pages/GenerateMaintenanceReport";
import StaffTicketPurchase from "./pages/StaffTicketPurchase";

import TicketDataReports from "./pages/TicketDataReports";
import RideDataReports from "./pages/RideDataReports";
import RevenueDataReports from "./pages/RevenueDataReports";

import CreateEmployeeAccount from "./pages/CreateEmployeeAccount";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployeeDataEntryForm";
import DeleteEmployee from "./pages/DeleteEmployeeDataEntryForm";
import AddAttraction from "./pages/AddAttractionDataEntryForm";
import UpdateAttraction from "./pages/UpdateAttractionDataEntryForm";
import DeleteAttraction from "./pages/DeleteAttractionDataEntryForm";
import AddVendor from "./pages/AddVendorDataEntryForm";
import UpdateVendor from "./pages/UpdateVendorDataEntryForm";
import DeleteVendor from "./pages/DeleteVendorDataEntryForm";
import AddAttractionLog from "./pages/AddAttractionLogDataEntryForm";
import AddWeatherLog from "./pages/AddWeatherLogDataEntryForm";
import AddDepartment from "./pages/AddDepartmentDataEntryForm.";
import UpdateDepartment from "./pages/UpdateDepartmentDataEntryForm";
import AddProduct from "./pages/AddProductDataEntryForm";
import UpdateProduct from "./pages/UpdateProductDataEntryForm";
import DeleteProduct from "./pages/DeleteProductDataEntryForm";

import { Navbar } from "./components/Navbar";
import { StaffNavbar } from "./components/StaffNavbar";

function App() {
  const location = useLocation();

  const staffPaths = ["/adminLanding"];

  const isStaffPage = staffPaths.includes(location.pathname);

  return (
    <>
      <div>
        {isStaffPage ? <StaffNavbar /> : <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parkInformation" element={<ParkInformation />} />
          <Route path="/staffSignIn" element={<StaffSignIn />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/updateaccount" element={<UpdateAccount />} />
          <Route path="/ticketPurchase" element={<TicketPurchase />} />
          <Route
            path="/staffticketpurchase"
            element={<StaffTicketPurchase />}
          />
          <Route path="/adminLanding" element={<AdminLanding />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/dataReports" element={<AdminDataReports />} />
          <Route path="/ticketDataReports" element={<TicketDataReports />} />
          <Route path="/rideDataReports" element={<RideDataReports />} />
          <Route path="/revenueDataReports" element={<RevenueDataReports />} />
          <Route
            path="/maintenanceRequestForm"
            element={<MaintenanceRequestForm />}
          />
          <Route
            path="/maintenanceUpdateRequest"
            element={<MaintenanceUpReq />}
          />
          <Route
            path="/maintenanceCompleteRequest"
            element={<MaintenanceCompReq />}
          />
          <Route
            path="/GenerateMaintenanceReport"
            element={<GenerateMaintRep />}
          />
          <Route path="/depManagement" element={<AdminDepManagement />} />
          <Route
            path="/CreateEmployeeAccount"
            element={<CreateEmployeeAccount />}
          />
          <Route path="/AddEmployee" element={<AddEmployee />} />
          <Route
            path="/updateemployeedataentryform"
            element={<UpdateEmployee />}
          />
          <Route
            path="/deleteemployeedataentryform"
            element={<DeleteEmployee />}
          />
          <Route
            path="/addattractiondataentryform"
            element={<AddAttraction />}
          />
          <Route
            path="/updateattractiondataentryform"
            element={<UpdateAttraction />}
          />
          <Route
            path="/deleteattractiondataentryform"
            element={<DeleteAttraction />}
          />
          <Route path="/addvendordataentryform" element={<AddVendor />} />
          <Route path="/updatevendordataentryform" element={<UpdateVendor />} />
          <Route path="/deletevendordataentryform" element={<DeleteVendor />} />
          <Route
            path="/addattractionlogdataentryform"
            element={<AddAttractionLog />}
          />
          <Route
            path="/addweatherlogdataentryform"
            element={<AddWeatherLog />}
          />
          <Route
            path="/adddepartmentlogdataentryform"
            element={<AddDepartment />}
          />
          <Route
            path="/updatedepartmentlogdataentryform"
            element={<UpdateDepartment />}
          />
          <Route path="/addproductdataentryform" element={<AddProduct />} />
          <Route
            path="/updateproductdataentryform"
            element={<UpdateProduct />}
          />
          <Route
            path="/deleteproductdataentryform"
            element={<DeleteProduct />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
