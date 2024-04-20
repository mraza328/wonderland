import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { attractions, date } = req.body;

    if (!attractions || !date) {
      return res
        .status(400)
        .json({ error: "Attractions and date are required." });
    }

    const pool = await poolPromise;

    for (const attraction of attractions) {
      try {
        const checkQuery = `
            SELECT * FROM AttractionLog
            WHERE NameOfAttraction = ? AND Date = ?
          `;
        const checkValues = [attraction, date];
        const [checkResult] = await pool.query(checkQuery, checkValues);

        console.log("Check Result:", checkResult);

        if (checkResult.length > 0) {
          const updateQuery = `
              UPDATE AttractionLog
              SET NumberOfOperations = NumberOfOperations + 1
              WHERE NameOfAttraction = ? AND Date = ?
            `;
          await pool.query(updateQuery, checkValues);
        } else {
          const insertQuery = `
              INSERT INTO AttractionLog (NameOfAttraction, Date, NumberOfOperations)
              VALUES (?, ?, 1)
            `;
          await pool.query(insertQuery, checkValues);
        }
      } catch (error) {
        throw error;
      }
    }

    res.status(200).json({ message: "Attraction log updated successfully." });
  } catch (error) {
    console.error("Error updating attraction log:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
