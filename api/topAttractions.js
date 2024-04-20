import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const formattedStartDate = startDate.toISOString().slice(0, 10);
    const formattedEndDate = endDate.toISOString().slice(0, 10);

    const pool = await poolPromise;
    const query = `
      SELECT NameOfAttraction, SUM(NumberOfOperations) AS TotalRiders
      FROM AttractionLog
      WHERE Date BETWEEN ? AND ?
      GROUP BY NameOfAttraction
      ORDER BY TotalRiders DESC
      LIMIT 3`;

    const queryParams = [formattedStartDate, formattedEndDate];
    const [rideDataResults] = await pool.query(query, queryParams);

    res.status(200).json({ topAttractions: rideDataResults });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
};
