import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
        name, hoursWorked, mggrUserID
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const departmentQuery =
      `INSERT INTO Department (DepName, HoursWorked, ManagerUserID) VALUES (?, ?, ?)`;
    const employeeQuery =
      `UPDATE Employee as A, Employee as B SET A.position=?, A.DepName=?, A.SupUserID=B.UserID WHERE A.UserID=? AND B.position=?`;

    const pool = await poolPromise;
    const [departmentResults] = await pool.query(departmentQuery, [
        name, hoursWorked, mggrUserID
    ]);

    const [employeeResults] = await pool.query(employeeQuery, [
        "Department Manager", name, mggrUserID, "Park Manager"
    ]);

    res.status(201).json({
      message: "Department added successfully",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ message: "Error adding department", error: error.message });
  }
};
