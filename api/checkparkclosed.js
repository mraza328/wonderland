import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      formattedDate,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const query = `SELECT * FROM Weatherlog WHERE DateOfClosure=?`;

    const pool = await poolPromise;
    const [result] = await pool.query(query, [
        formattedDate
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to get employee:", error);
    res.status(500).json({
      message: "Failed to get employee",
      error: error.message,
    });
  }
};