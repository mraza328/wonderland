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
        data += chunk.toString(); // Collecting data chunks
      });
      req.on("end", () => {
        try {
          resolve(JSON.parse(data)); // Parsing the collected data
        } catch (parseError) {
          reject(parseError); // Handling JSON parsing error
        }
      });
      req.on("error", (err) => reject(err)); // Handling streaming errors
    });

    let { ManagerApproval: managerApproval, RequestID: requestId } = body;
    managerApproval = 0; // Resetting the approval status

    const maintenanceUpdateQuery = `
      UPDATE Maintenance
      SET ManagerApproval = ?, MaintenanceStatus = 'Active'
      WHERE RequestID = ?
    `;

    const pool = await poolPromise;
    await pool.query(maintenanceUpdateQuery, [managerApproval, requestId]); // Passing parameters correctly

    res.status(200).json({
      message: "Maintenance request approved successfully!",
    });
  } catch (error) {
    console.error("Failed to approve maintenance request:", error);
    res.status(500).json({
      message: "Failed to approve maintenance request",
      error: error.message,
    });
  }
};
