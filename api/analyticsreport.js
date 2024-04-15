import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    const { startDate, endDate, selectedRide, selectedAttractionType } =
      req.body;
    const pool = await poolPromise;

    let query = "";
    let queryParams = [];

    query = `
      SELECT DATE_FORMAT(AttractionLog.Date, '%m/%d/%Y') AS Date, 
        AttractionLog.NameOfAttraction, 
        Attraction.AttractionType, 
        SUM(AttractionLog.NumberOfOperations) AS TotalRiders
      FROM AttractionLog
      JOIN Attraction ON AttractionLog.NameOfAttraction = Attraction.NameOfAttraction
      WHERE AttractionLog.Date BETWEEN ? AND ?
      `;
    queryParams = [startDate, endDate];

    if (selectedRide !== "All") {
      query += ` AND AttractionLog.NameOfAttraction = ?`;
      queryParams.push(selectedRide);
    }

    if (selectedAttractionType !== "All") {
      query += ` AND Attraction.AttractionType = ?`;
      queryParams.push(selectedAttractionType);
    }

    query += ` GROUP BY DATE_FORMAT(AttractionLog.Date, '%m/%d/%Y'), AttractionLog.NameOfAttraction, Attraction.AttractionType ORDER BY Date`;

    const [reportData] = await pool.query(query, queryParams);

    // Calculate total riders
    const totalRiders = reportData.reduce(
      (acc, entry) => acc + parseInt(entry.TotalRiders),
      0
    );

    res.status(200).json({ reportData, totalRiders });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
};
