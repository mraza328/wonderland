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

    // Subquery to get the date with the most visitors
    const peakSubQuery = `
      SELECT DATE_FORMAT(AttractionLog.Date, '%m/%d/%Y') AS PeakDate,
        SUM(AttractionLog.NumberOfOperations) AS PeakVisitors
      FROM AttractionLog
      WHERE AttractionLog.Date BETWEEN ? AND ?
      GROUP BY DATE_FORMAT(AttractionLog.Date, '%m/%d/%Y')
      ORDER BY PeakVisitors DESC
      LIMIT 1`;
    queryParams.push(startDate, endDate);

    const [peakActivity] = await pool.query(
      peakSubQuery,
      queryParams.slice(-2)
    );

    // Subquery to get the date with the least visitors
    const leastPopularSubQuery = `
      SELECT DATE_FORMAT(AttractionLog.Date, '%m/%d/%Y') AS LeastPopularDate,
        SUM(AttractionLog.NumberOfOperations) AS LeastVisitors
      FROM AttractionLog
      WHERE AttractionLog.Date BETWEEN ? AND ?
      GROUP BY DATE_FORMAT(AttractionLog.Date, '%m/%d/%Y')
      ORDER BY LeastVisitors ASC
      LIMIT 1`;
    queryParams.push(startDate, endDate);

    const [leastPopularDay] = await pool.query(
      leastPopularSubQuery,
      queryParams.slice(-2)
    );

    // Subquery to find the most popular ride
    const mostPopularRideSubQuery = `
    SELECT NameOfAttraction,
      SUM(AttractionLog.NumberOfOperations) AS TotalRiders
    FROM AttractionLog
    WHERE Date BETWEEN ? AND ?
    GROUP BY NameOfAttraction
    ORDER BY TotalRiders DESC
    LIMIT 1`;

    const [mostPopularRide] = await pool.query(
      mostPopularRideSubQuery,
      queryParams
    );

    const totalRiders = reportData.reduce(
      (acc, entry) => acc + parseInt(entry.TotalRiders),
      0
    );

    const mostPopularRideRiders = mostPopularRide[0]?.TotalRiders || 0;
    const mostPopularRidePercentage =
      (mostPopularRideRiders / totalRiders) * 100;

    res.status(200).json({
      reportData,
      totalRiders,
      peakActivity,
      leastPopularDay,
      mostPopularRide,
      mostPopularRidePercentage,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
};
