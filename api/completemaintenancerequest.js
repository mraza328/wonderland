import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", () => resolve(JSON.parse(data)));
      req.on("error", (err) => reject(err));
    });

    const { RequestID: requestId } = body;

    const updateStatusQuery = `
      UPDATE Maintenance
      SET MaintenanceStatus = 'Completed'
      WHERE RequestID = ?
    `;

    const pool = await poolPromise;
    const [updateResult] = await pool.query(updateStatusQuery, [requestId]);

    if (updateResult.affectedRows > 0) {
      res.status(200).json({
        message: "Maintenance status Completed successfully",
      });
    } else {
      res.status(404).json({
        message: "No record found with the provided RequestID",
      });
    }
  } catch (error) {
    console.error("Failed to complete maintenance status:", error);
    res.status(500).json({
      message: "Failed to complete maintenance status",
      error: error.message,
    });
  }
};
