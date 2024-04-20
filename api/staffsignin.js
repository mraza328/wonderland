import bcrypt from "bcryptjs";
import { poolPromise } from "./database.js";

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

    if (user.AccountStatus === "Inactive") {
      res.status(403).json({ message: "Account is Inactive" });
      return;
    }

    const passwordIsValid = await bcrypt.compare(password, user.Password);

    if (!passwordIsValid) {
      res.status(401).json({ message: "Incorrect User ID or Password" });
      return;
    }

    if (user.AccountType === "Customer") {
      res.status(401).json({ message: "Please use Customer Log In Portal" });
      return;
    }

    const positionQuery = `
SELECT 
    e.position, 
    e.depname, 
    COALESCE(CONCAT(s.FirstName, ' ', s.LastName), 'No Supervisor') AS SupervisorName, 
    COALESCE(e.Street, 'Not specified') AS Street, 
    e.Salary
FROM 
    Employee e
LEFT JOIN 
    Employee s ON e.SupUserID = s.UserID
WHERE 
    e.UserID = ?
`;
    const [positionResults] = await pool.query(positionQuery, [user.UserID]);

    console.log(positionResults);

    const employeeDetails =
      positionResults.length > 0
        ? positionResults[0]
        : { position: "Not specified", depname: "Not specified" };

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
      position: employeeDetails.position,
      depname: employeeDetails.depname,
      supervisorName: employeeDetails.SupervisorName,
      street: employeeDetails.Street,
      salary: employeeDetails.Salary,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
}
