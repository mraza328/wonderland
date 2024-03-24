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

    const stateID = 0; // Keeping this as in original code, assuming it's a fixed value

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
    await pool.query(maintenanceQuery, [
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

    res.status(201).json({
      message: "Maintenance request submitted successfully",
    });
  } catch (error) {
    console.error("Failed to submit maintenance request:", error);
    res.status(500).json({
      message: "Failed to submit maintenance request",
      error: error.message,
    });
  }
};
