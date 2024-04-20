import { poolPromise } from "./database.js";

export default async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      selectedVendor,
      selectedVendorType,
      selectedProduct,
    } = req.body;
    const pool = await poolPromise;

    let query = "";
    let queryParams = [];

    query = `
      SELECT DATE_FORMAT(Sale.DateSold, '%m/%d/%Y') AS Date,
        Vendor.NameOfVendor,
        Vendor.VendorType,
        Product.NameOfItem AS ProductName,
        SUM(Ticket.TicketPrice) AS TotalSales
      FROM Sale
      JOIN Ticket ON Sale.SaleID = Ticket.SaleID
      JOIN Product ON Ticket.FoodItemID = Product.ItemID OR Ticket.MerchItemID = Product.ItemID
      JOIN Vendor ON Product.NameOfVendor = Vendor.NameOfVendor
      WHERE Sale.DateSold BETWEEN ? AND ?
    `;
    queryParams = [startDate, endDate];

    if (selectedVendor !== "All") {
      query += ` AND Vendor.NameOfVendor = ?`;
      queryParams.push(selectedVendor);
    }

    if (selectedVendorType !== "All") {
      query += ` AND Vendor.VendorType = ?`;
      queryParams.push(selectedVendorType);
    }

    if (selectedProduct !== "All") {
      query += ` AND Product.ItemID = ?`;
      queryParams.push(selectedProduct);
    }

    query += ` GROUP BY DATE_FORMAT(Sale.DateSold, '%m/%d/%Y'), Vendor.NameOfVendor, Vendor.VendorType, Product.NameOfItem ORDER BY Date`;

    const [reportData] = await pool.query(query, queryParams);

    const totalSales = reportData.reduce(
      (acc, entry) => acc + parseFloat(entry.TotalSales),
      0
    );

    const formattedTotalSales = totalSales.toFixed(2);

    res.status(200).json({
      reportData,
      totalSales: formattedTotalSales,
    });
  } catch (error) {
    console.error("Error generating vendor report:", error);
    res.status(500).json({ error: "Error generating vendor report" });
  }
};
