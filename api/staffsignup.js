import bcrypt from "bcryptjs";
import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      dateOfBirth,
      phoneNumber,
      password,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const accountType = "Employee";

    // Use bcrypt to hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10);

    const accountQuery =
      "INSERT INTO Account (accountType, firstName, middleName, lastName, email, dateOfBirth, phoneNumber, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    const pool = await poolPromise;
    const [accountResult] = await pool.query(accountQuery, [
      accountType,
      firstName,
      middleName,
      lastName,
      email,
      dateOfBirth,
      phoneNumber,
      hashedPassword,
    ]);

    const userID = accountResult.insertId;

    res.status(201).json({
      message: "User created successfully",
      userId: userID,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      email: email,
      dateOfBirth: dateOfBirth,
      phoneNumber: phoneNumber,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};
