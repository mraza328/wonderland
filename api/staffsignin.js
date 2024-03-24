// Import bcrypt and the pool promise using ES Module syntax
import bcrypt from "bcryptjs";
import { poolPromise } from "./database.js"; // Adjust the path as necessary

export default async function handleStaffSignIn(req, res) {
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
    const accountQuery = "SELECT * FROM Account WHERE email = ?";

    const [results] = await pool.query(accountQuery, [email]);

    if (results.length === 0) {
      res.status(401).json({ message: "Incorrect User ID or Password" });
      return;
    }

    const user = results[0];
    const passwordIsValid = await bcrypt.compare(password, user.Password);

    if (!passwordIsValid) {
      res.status(401).json({ message: "Incorrect User ID or Password" });
      return;
    }

    if (user.AccountType === "Customer") {
      res.status(401).json({ message: "Please use Customer Log In Portal" });
      return;
    }

    const positionQuery =
      "SELECT position, depname FROM Employee WHERE UserID = ?";
    const [positionResults] = await pool.query(positionQuery, [user.UserID]);

    const employeeDetails =
      positionResults.length > 0
        ? positionResults[0]
        : { position: "Not specified", depname: "Not specified" };

    res.status(200).json({
      message: "Authentication successful",
      userID: user.UserID,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      accountType: user.AccountType,
      phoneNumber: user.PhoneNumber,
      position: employeeDetails.position,
      depname: employeeDetails.depname,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
}
