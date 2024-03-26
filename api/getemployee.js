import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      employeeId,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const getEmployeeQuery = `SELECT * FROM Employee WHERE UserID=?`;

    const pool = await poolPromise;
    const [result] = await pool.query(getEmployeeQuery, [
      employeeId
    ]);

    if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "No employee found" });
      }
  } catch (error) {
    console.error("Failed to get employee:", error);
    res.status(500).json({
      message: "Failed to get employee",
      error: error.message,
    });
  }
};
