import bcrypt from "bcryptjs";
import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { email, password } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const pool = await poolPromise;
    const query = "SELECT * FROM Account WHERE email = ?";

    const [results] = await pool.query(query, [email]);

    if (results.length === 0) {
      res.status(401).json({ message: "Incorrect User ID or Password" });
      return;
    }

    const user = results[0];

    if (user.AccountStatus === "Inactive") {
      res.status(403).json({ message: "Account is Inactive" });
      return;
    }

    // Compare password asynchronously
    const passwordIsValid = await bcrypt.compare(password, user.Password);

    if (!passwordIsValid || user.AccountType !== "Customer") {
      res.status(401).json({
        message:
          user.AccountType !== "Customer"
            ? "Please use Staff Log In Portal"
            : "Incorrect User ID or Password",
      });
      return;
    }

    // Respond with user information on successful authentication
    res.status(200).json({
      message: "Authentication successful",
      userID: user.UserID,
      firstName: user.FirstName,
      middleName: user.MiddleName,
      lastName: user.LastName,
      dateOfBirth: user.DateOfBirth,
      email: user.Email,
      accountType: user.AccountType,
      phoneNumber: user.PhoneNumber,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
};
