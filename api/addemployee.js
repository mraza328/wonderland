import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      userId,
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      position,
      supUserId: rawSupUserId,
      salary,
      address,
      department,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const supUserId = rawSupUserId === "" ? null : rawSupUserId;

    const status = "Active";
    const { street, city, state, zipcode } = address;

    const employeeQuery = `
      INSERT INTO Employee (
        userId,
        firstName, 
        middleName, 
        lastName, 
        phoneNumber, 
        email, 
        position, 
        supUserId, 
        salary, 
        street, 
        city, 
        state, 
        zipcode, 
        status, 
        depName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const pool = await poolPromise;
    const [employeeResult] = await pool.query(employeeQuery, [
      userId,
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      position,
      supUserId,
      salary,
      street,
      city,
      state,
      zipcode,
      status,
      department,
    ]);

    res.status(201).json({
      message: "Employee added successfully",
      employeeId: employeeResult.insertId,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ message: "Error adding employee", error: error.message });
  }
};
