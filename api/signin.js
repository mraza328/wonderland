// Import bcrypt and the pool promise using ES Module syntax
import bcrypt from "bcryptjs";
import { poolPromise } from "./database.js"; // Import poolPromise for consistency

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    // Await the request body parsing as in signup.js
    const { email, password } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    // Use the promise-based pool
    const pool = await poolPromise;
    const query = "SELECT * FROM Account WHERE email = ?";

    // Execute query using promise instead of callback
    const [results] = await pool.query(query, [email]);

    if (results.length === 0) {
      res.status(401).json({ message: "Incorrect User ID or Password" });
      return;
    }

    const user = results[0];

    // Compare password asynchronously
    const passwordIsValid = await bcrypt.compare(password, user.Password);

    if (!passwordIsValid || user.AccountType !== "Customer") {
      res.status(401).json({
        message:
          user.accountType !== "Customer"
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
      lastName: user.LastName,
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
