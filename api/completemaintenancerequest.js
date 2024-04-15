import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
      req.on("error", (err) => reject(err));
    });

    const {
      userID: userId,
      departmentName: depName,
      attractionName: nameOfAttraction,
      reasonForRequest: descriptionOfRequest,
      submissionDate: date,
      completionDate: dateCompleted,
      maintenanceStatus,
      estimatedCost: expense,
      StateID: stateId,
      RequestID: requestId,
    } = body;

    let incrementedStateID = stateId + 1;

    const maintenanceUpdateQuery = `
      INSERT INTO Maintenance (
        UserID,
        DepName,
        NameOfAttraction,
        DescriptionOfRequest,
        Date,
        DateCompleted,
        MaintenanceStatus,
        Expense,
        StateID,
        RequestID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const pool = await poolPromise;
    await pool.query(maintenanceUpdateQuery, [
      userId,
      depName,
      nameOfAttraction,
      descriptionOfRequest,
      date,
      dateCompleted,
      maintenanceStatus,
      expense,
      incrementedStateID,
      requestId,
    ]);

    const updateAttractionStatus = `
      UPDATE Attraction
      SET AttractionStatus = 'Active'
      WHERE NameOfAttraction = ?
    `;
    const [attractionResult] = await pool.query(updateAttractionStatus, [
      nameOfAttraction,
    ]);

    if (attractionResult.affectedRows > 0) {
      res.status(200).json({
        message: "Maintenance and attraction status updated successfully!",
      });
    } else {
      res.status(404).json({
        message: "No record found with the provided RequestID",
      });
    }
  } catch (error) {
    console.error("Failed to complete maintenance:", error);
    res.status(500).json({
      message: "Failed to update maintenance and attraction status",
      error: error.message,
    });
  }
};
