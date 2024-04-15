import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    const { startDate, endDate, selectedRide, selectedAttractionType } =
      req.body;

    // Retrieve data from the database based on startDate, endDate, selectedRide, and selectedAttractionType
    const pool = await poolPromise;
    let query = `
        SELECT DATE_FORMAT(AttractionLog.Date, '%m/%d/%Y') AS Date, 
          AttractionLog.NameOfAttraction, 
          Attraction.AttractionType, 
          SUM(AttractionLog.NumberOfOperations) AS TotalRiders
        FROM AttractionLog
        JOIN Attraction ON AttractionLog.NameOfAttraction = Attraction.NameOfAttraction
        WHERE AttractionLog.Date BETWEEN ? AND ?
        GROUP BY DATE_FORMAT(AttractionLog.Date, '%m/%d/%Y'), AttractionLog.NameOfAttraction, Attraction.AttractionType
        ORDER BY Date;`;

    const queryParams = [startDate, endDate];

    if (selectedRide !== "All") {
      query += ` AND AttractionLog.NameOfAttraction = ?`;
      queryParams.push(selectedRide);
    }

    if (selectedAttractionType !== "All") {
      query += ` AND Attraction.AttractionType = ?`;
      queryParams.push(selectedAttractionType);
    }

    //query += ` GROUP BY Date, AttractionLog.NameOfAttraction, Attraction.AttractionType`;

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
