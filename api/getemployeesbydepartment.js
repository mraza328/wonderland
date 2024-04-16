import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { department } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const query = `SELECT * FROM Employee WHERE DepName = ? AND Position IN ('Employee', 'Maintenance', 'Department Manager') AND Status = 'Active'`;

    const pool = await poolPromise;
    const [result] = await pool.query(query, [department]);

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res
        .status(404)
        .json({ message: "No employees found in this department" });
    }
  } catch (error) {
    console.error("Failed to get employees by department:", error);
    res.status(500).json({
      message: "Failed to get employees by department",
      error: error.message,
    });
  }
};
