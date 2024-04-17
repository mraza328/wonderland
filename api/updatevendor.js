import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
        NameOfVendor,
        origVendorName
      } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    // Validations
    let errors = [];
    let errorFields = [];

    if (!NameOfVendor) {
        errors.push("Name is required.");
        errorFields.push("name");
    }

    if (NameOfVendor.length > 100) {
      errors.push("Name must be 100 characters or less");
      errorFields.push("name");
    }

    if (errors.length > 0) {
      res.status(400).json({ errors, errorFields });
      return;
    }

    const query = `UPDATE Vendor SET NameOfVendor=? WHERE NameOfVendor=?`;

    const pool = await poolPromise;
    await pool.query(query, [
        NameOfVendor,
        origVendorName
    ]);

    res.status(200).json({
      message: "Vendor updated successfully",
    });
  } catch (error) {
    console.error("Failed to update vendor:", error);
    res.status(500).json({
      message: "Failed to update vendor",
      error: error.message,
    });
  }
};
