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

    // After the insert, retrieve the ManagerApproval for the newly inserted record
    const approvalQuery = `SELECT ManagerApproval FROM maintenance WHERE RequestID = ? AND StateID = ? ORDER BY RequestID DESC LIMIT 1`;
    const [approvalResult] = await pool.query(approvalQuery, [
      requestId,
      incrementedStateID,
    ]);
    const managerApproval = approvalResult[0]?.ManagerApproval;

    if (managerApproval == 1) {
      res.status(201).json({
        message: "Cost exceeds $5000. Pending manager approval.",
        managerApproval: managerApproval, // Return ManagerApproval from the database
      });
    } else {
      res.status(200).json({
        message: "Maintenance request submitted successfully",
      });
    }
  } catch (error) {
    console.error("Failed to submit maintenance request:", error);
    if (error.sqlState === "45000") {
      res.status(409).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "An error occurred while processing your request.",
      });
    }
  }
};
