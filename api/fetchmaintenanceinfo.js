import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    const query = `SELECT * FROM Maintenance`;
    const pool = await poolPromise;
    const [results] = await pool.query(query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Failed to fetch maintenance info:", error);
    res.status(500).json({
      message: "Failed to fetch maintenance info",
      error: error.message,
    });
  }
};
