import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    const { startDate, endDate, selectedRide } = req.body;

    // Retrieve data from the database based on startDate, endDate, and selectedRide
    const pool = await poolPromise;
    let query = `
      SELECT DATE_FORMAT(Date, '%m/%d/%Y') AS Date, NameOfAttraction, SUM(NumberOfOperations) AS TotalRiders
      FROM AttractionLog
      WHERE Date BETWEEN ? AND ?`;

    const queryParams = [startDate, endDate];

    if (selectedRide !== "All") {
      query += ` AND NameOfAttraction = ?`;
      queryParams.push(selectedRide);
    }

    query += ` GROUP BY Date, NameOfAttraction`;

    const [rideDataResults] = await pool.query(query, queryParams);

    // Calculate total riders
    const totalRiders = rideDataResults.reduce(
      (total, entry) => total + parseInt(entry.TotalRiders),
      0
    );

    res.status(200).json({ rideData: rideDataResults, totalRiders });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
};
