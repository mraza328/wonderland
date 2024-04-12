import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { userID } = req.body; // Retrieve userID from request body

  try {
    // Use the promise-based pool
    const pool = await poolPromise;

    const purchaseHistoryQuery = `
      SELECT DateSold, TotalPrice
      FROM Sale
      WHERE UserID = ?
      ORDER BY DateSold DESC
    `;

    const [purchaseHistoryResults] = await pool.query(purchaseHistoryQuery, [
      userID,
    ]);

    const purchaseHistory = purchaseHistoryResults.map((purchase) => ({
      date: purchase.DateSold,
      totalPrice: purchase.TotalPrice,
    }));

    res.status(200).json(purchaseHistory);
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({ message: "Error fetching purchase history" });
  }
};
