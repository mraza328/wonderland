import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      DepName: depName,
      HoursWorked: hoursWorked,
      ManagerUserID: mggrUserID,
      OldManagerUserID: oldMggrUserID,
      OldDepartmentName: oldDepartmentName,
      newDepartment: newDepName,
      newPosition: newPosition,
      newSupID: newSupID,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const departmentQuery =
      "UPDATE Department SET DepName=?, ManagerUserID=? WHERE DepName=?";
    const employeeQuery =
      "UPDATE Employee as A, Employee as B SET A.position=?, A.DepName=?, A.SupUserID=B.UserID WHERE A.UserID=? AND B.position=?";
    const updateEmployeeQuery =
      "Update Employee Set position=?, SupUserID=?, DepName=? WHERE UserID=?";

    const pool = await poolPromise;
    await pool.query(departmentQuery, [depName, mggrUserID, oldDepartmentName]);

    if (mggrUserID !== oldMggrUserID) {
      await pool.query(employeeQuery, [
        "Department Manager", oldDepartmentName, mggrUserID, "Park Manager"
      ]);

      await pool.query(updateEmployeeQuery, [
        newPosition, newSupID, newDepName, oldMggrUserID
      ]);
    }

    res.status(200).json({
      message: "Department updated successfully",
    });
  } catch (error) {
    console.error("Failed to update department:", error);
    res.status(500).json({
      message: "Failed to update department",
      error: error.message,
    });
  }
};
