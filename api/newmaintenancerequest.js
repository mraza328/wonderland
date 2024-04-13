import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      userID: userId,
      departmentName: depName,
      attractionName: nameOfAttraction,
      reasonForRequest: descriptionOfRequest,
      submissionDate: date,
      completionDate: dateCompleted,
      maintenanceStatus,
      estimatedCost: expense,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const stateID = 0;

    const maintenanceQuery = `
      INSERT INTO Maintenance (
        UserID,
        DepName,
        NameOfAttraction,
        DescriptionOfRequest,
        Date,
        DateCompleted,
        MaintenanceStatus,
        Expense,
        StateID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const pool = await poolPromise;
    const [insertResult] = await pool.query(maintenanceQuery, [
      userId,
      depName,
      nameOfAttraction,
      descriptionOfRequest,
      date,
      dateCompleted,
      maintenanceStatus,
      expense,
      stateID,
    ]);

    const requestId = insertResult.insertId; // Capture the RequestID from the insert operation

    const updateAttractionStatus = `
      UPDATE Attraction
      SET AttractionStatus = 'Out of Order'
      WHERE NameOfAttraction = ?
    `;
    await pool.query(updateAttractionStatus, [nameOfAttraction]);

    // Retrieve the ManagerApproval for the newly inserted record using RequestID and StateID
    const approvalQuery = `SELECT ManagerApproval FROM Maintenance WHERE RequestID = ? AND StateID = ? LIMIT 1`;
    const [approvalResult] = await pool.query(approvalQuery, [
      requestId,
      stateID,
    ]);
    const managerApproval = approvalResult[0]?.ManagerApproval;

    if (managerApproval == 1) {
      res.status(201).json({
        message: "Cost exceeds $5000. Pending manager approval.",
        managerApproval: managerApproval,
      });
    } else {
      res.status(200).json({
        message: "Maintenance request submitted successfully",
      });
    }
  } catch (error) {
    console.error("Failed to submit maintenance request:", error);
    res.status(500).json({
      message: "Failed to submit maintenance request",
      error: error.message,
    });
  }
};
