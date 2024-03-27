import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const query = `SELECT * FROM Product WHERE ProductStatus=?`;

    const pool = await poolPromise;
    const [results] = await pool.query(query, ['Active']);

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    console.error("Failed to get products:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
