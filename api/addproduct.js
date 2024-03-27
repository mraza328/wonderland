import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { name, vendor, acquisitionCost, price, description, status } =
      await new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk.toString()));
        req.on("end", () => resolve(JSON.parse(body)));
        req.on("error", (err) => reject(err));
      });

    const profit = price - acquisitionCost;
    // Validations
    let errors = [];
    let errorFields = [];

    if (name.length > 100) {
      errors.push("Name must be 100 characters or less");
      errorFields.push("name");
    }

    if (acquisitionCost < 0) {
      errors.push("Acquisition Cost must be non-negative");
      errorFields.push("acquisitionCost");
    }

    if (price < 0) {
      errors.push("Sale Price must be non-negative");
      errorFields.push("price");
    }

    if (profit < 0) {
      errors.push("Sale Price must be larger than Acquisition Cost");
      if(!errorFields.includes("price")){
        errorFields.push("price");
      }
      if(!errorFields.includes("acquisitionCost")){
        errorFields.push("acquisitionCost");
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ errors, errorFields });
      return;
    }

    // Database insertion
    const query = `INSERT INTO Product (NameOfItem, NameOfVendor, AcquisitionCost, SalePrice, Profit, Description, ProductStatus) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const pool = await poolPromise;
    await pool.query(query, [
        name,
        vendor,
        acquisitionCost,
        price,
        profit,
        description,
        status,
    ]);

    res.status(201).json({
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
};
