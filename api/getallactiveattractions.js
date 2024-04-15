import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    const query = `
        SELECT * FROM Attraction
        WHERE AttractionStatus = 'Active'`;

    const pool = await poolPromise;
    const [results] = await pool.query(query);

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "No active attractions found" });
    }
  } catch (error) {
    console.error("Failed to get attractions:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
