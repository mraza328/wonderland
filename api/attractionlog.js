import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    // Parse input data from the request body
    const { attractions, date } = req.body;

    // Ensure attractions and date are provided
    if (!attractions || !date) {
      return res
        .status(400)
        .json({ error: "Attractions and date are required." });
    }

    // Use the promise-based pool
    const pool = await poolPromise;

    // Iterate over attractions
    for (const attraction of attractions) {
      try {
        // Check if the attraction log entry already exists for the given date and attraction
        const checkQuery = `
            SELECT * FROM AttractionLog
            WHERE NameOfAttraction = ? AND Date = ?
          `;
        const checkValues = [attraction, date];
        const [checkResult] = await pool.query(checkQuery, checkValues);

        console.log("Check Result:", checkResult);

        if (checkResult.length > 0) {
          // If the attraction log entry exists, update the number of operations
          const updateQuery = `
              UPDATE AttractionLog
              SET NumberOfOperations = NumberOfOperations + 1
              WHERE NameOfAttraction = ? AND Date = ?
            `;
          await pool.query(updateQuery, checkValues);
        } else {
          // If the attraction log entry does not exist, insert a new entry
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

    // Send success response
    res.status(200).json({ message: "Attraction log updated successfully." });
  } catch (error) {
    // Handle errors
    console.error("Error updating attraction log:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
