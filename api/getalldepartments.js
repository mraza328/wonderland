import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const query = `
        SELECT * FROM Department`;

    const pool = await poolPromise;
    const [results] = await pool.query(query);

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.status(404).json({ message: "No departments found" });
    }
  } catch (error) {
    console.error("Failed to get departments:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
