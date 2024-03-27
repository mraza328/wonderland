import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
        name,
        type,
        status,
        department,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    // Validations
    let errors = [];
    let errorFields = [];

    if (!name) {
        errors.push("Name is required.");
        errorFields.push("name");
    }

    if (!type) {
        errors.push("Type is required.");
        errorFields.push("type");
    }

    if (type!=='Food' && type!=='Merchandise') {
        errors.push("Please select a valid type: Food or Merchandise");
        errorFields.push("type");
    }

    if (errors.length > 0) {
      res.status(400).json({ errors, errorFields });
      return;
    }

    // Database insertion
    const query = `INSERT INTO Vendor (NameOfVendor, VendorType, VendorStatus, DepName) VALUES (?, ?, ?, ?)`;

    const pool = await poolPromise;
    await pool.query(query, [
        name,
        type,
        status, //active 
        department, //vendor
    ]);

    res.status(201).json({
      message: "Vendor added successfully",
    });
  } catch (error) {
    console.error("Failed to add vendor:", error);
    res.status(500).json({
      message: "Failed to add vendor",
      error: error.message,
    });
  }
};
