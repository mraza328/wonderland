import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    const { name } = req.body;

    const checkQuery = `
      SELECT * FROM Attraction
      WHERE NameOfAttraction = ? AND AttractionStatus = 'Active'
    `;

    const updateQuery = `
      UPDATE Attraction
      SET AttractionStatus = 'Inactive'
      WHERE NameOfAttraction = ?
    `;

    const pool = await poolPromise;
    const [checkResults] = await pool.query(checkQuery, [name]);

    if (checkResults.length > 0) {
      await pool.query(updateQuery, [name]);
      res
        .status(200)
        .json({ message: "Attraction status updated to Inactive" });
    } else {
      res
        .status(404)
        .json({ message: "Attraction not found or already inactive" });
    }
  } catch (error) {
    console.error("Failed to update attraction status:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
