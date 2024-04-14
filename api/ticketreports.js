import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { customerID } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const query = `SELECT * FROM TicketReport Where (UserID = ? OR ? IS NULL)`;

    const pool = await poolPromise;
    const [results] = await pool.query(query, [customerID, customerID]);

    res.status(200).json(results);
  } catch (error) {
    console.error("Failed to fetch ticket report:", error);
    res.status(500).json({
      message: "Failed to fetch ticket report",
      error: error.message,
    });
  }
};
