import bcrypt from "bcryptjs";
import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "PUT" && req.method !== "PATCH") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      userID,
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
      "UPDATE account SET AccountType = ?, FirstName = ?, MiddleName = ?, LastName = ?, Email = ?, DateOfBirth = ?, PhoneNumber = ?, Password = ? WHERE UserID = ?";

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
      userID,
    ]);

    const customerQuery =
      "UPDATE customer SET FirstName = ?, LastName = ?, DateOfBirth = ? WHERE UserID = ?";

    // Insert the customer details using the retrieved UserID
    await pool.query(customerQuery, [firstName, lastName, dateOfBirth, userID]);

    res
      .status(201)
      .json({ message: "User account and customer updated successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};
