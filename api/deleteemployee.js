import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { employeeID, status } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
      req.on("error", (err) => reject(err));
    });

    const query = `UPDATE Employee SET Status=? WHERE UserID=?`;
    const accountStatusQuery = `UPDATE Account SET AccountStatus = 'Inactive' WHERE UserID = ?`;

    const pool = await poolPromise;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [employeeResult] = await connection.query(query, [
        status,
        employeeID,
      ]);
      const [accountResult] = await connection.query(accountStatusQuery, [
        employeeID,
      ]);

      if (employeeResult.affectedRows > 0 && accountResult.affectedRows > 0) {
        await connection.commit();
        res.status(200).json({
          message: "Employee and account status updated successfully",
        });
      } else {
        await connection.rollback();
        res.status(404).json({
          message:
            "Employee or account not found, please enter a valid Employee ID.",
        });
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Failed to update employee and account:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
