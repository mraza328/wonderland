import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { employeeID, status } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const query = `UPDATE Employee SET Status=? WHERE UserID=?`;

    const pool = await poolPromise;
    const [result] = await pool.query(query, [status, employeeID]);

    if (result.affectedRows > 0) {
      res.status(200).json({
        message: "Employee deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Employee Not Found",
      });
    }
  } catch (error) {
    console.error("Failed to delete employee:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
