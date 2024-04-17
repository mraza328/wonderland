import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { vendorName } = req.body;

    const query = `SELECT * FROM Product WHERE NameOfVendor = ? AND ProductStatus = ?`;

    const pool = await poolPromise;
    const [results] = await pool.query(query, [vendorName, "Active"]);

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res
        .status(404)
        .json({ message: "No products found for the selected vendor" });
    }
  } catch (error) {
    console.error("Failed to get products by vendor:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
