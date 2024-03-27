import bcrypt from "bcryptjs";
import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      email,
      password,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      phoneNumber,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const accountType = "Customer";

    // Use bcrypt to hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 8);

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

    // Get the inserted account's UserID
    const userID = accountResult.insertId;

    const customerQuery =
      "INSERT INTO Customer (UserID, FirstName, LastName, DateOfBirth) VALUES (?, ?, ?, ?)";

    // Insert the customer details using the retrieved UserID
    await pool.query(customerQuery, [userID, firstName, lastName, dateOfBirth]);

    res
      .status(201)
      .json({ message: "User account and customer created successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};
