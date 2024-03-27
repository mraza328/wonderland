import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { vendorName, status } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    const query = `UPDATE Vendor SET VendorStatus=? WHERE NameOfVendor=? AND VendorStatus=?`;

    const pool = await poolPromise;
    const [result] = await pool.query(query, [status, vendorName, "Active"]);

    res.status(200).json({
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete vendor:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
