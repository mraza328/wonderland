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
      req.on("end", () => resolve(JSON.parse(data)));
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

    console.log(
      `Maintenance request ${requestId} updated successfully with new StateID: ${incrementedStateID}`
    );

    res.status(201).json({
      message: "Maintenance request submitted successfully",
      RequestID: requestId,
      IncrementedStateID: incrementedStateID,
    });
  } catch (error) {
    console.error("Failed to insert maintenance request:", error);
    res.status(500).json({
      message: "Failed to submit maintenance request",
      error: error.message,
    });
  }
};
