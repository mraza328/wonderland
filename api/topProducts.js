import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    const pool = await poolPromise;
    const query = `
      SELECT p.NameOfItem AS ProductName, v.NameOfVendor AS VendorName, COUNT(*) AS SalesCount
      FROM Sale s
      INNER JOIN Ticket t ON s.SaleID = t.SaleID
      INNER JOIN Product p ON t.FoodItemID = p.ItemID OR t.MerchItemID = p.ItemID
      INNER JOIN Vendor v ON p.NameOfVendor = v.NameOfVendor
      WHERE s.DateSold BETWEEN ? AND ?
      GROUP BY p.NameOfItem, v.NameOfVendor
      ORDER BY SalesCount DESC
      LIMIT 3`;

    const queryParams = [
      startDate.toISOString().slice(0, 10),
      endDate.toISOString().slice(0, 10),
    ];
    const [productSalesResults] = await pool.query(query, queryParams);

    res.status(200).json({ topProducts: productSalesResults });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Error generating report" });
  }
};
