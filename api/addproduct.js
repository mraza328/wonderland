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

    if(!name){
      errors.push("Name is required.");
      errorFields.push("name");
    }

    if (name.length > 100) {
      errors.push("Name must be 100 characters or less");
      errorFields.push("name");
    }

    if(!description){
      errors.push("Description is required.");
      errorFields.push("description");
    }

    if (description.length > 255) {
      errors.push("Description must be 255 characters or less");
      errorFields.push("description");
    }

    if (acquisitionCost < 0) {
      errors.push("Acquisition Cost must be non-negative");
      errorFields.push("acquisitionCost");
    }

    if (acquisitionCost >= 1000) {
      errors.push("Acquisition Cost must be below $1000");
      errorFields.push("acquisitionCost");
    }

    if (price < 0) {
      errors.push("Sale Price must be non-negative");
      errorFields.push("price");
    }

    if (price >= 1000) {
      errors.push("Acquisition Cost must be below $1000");
      errorFields.push("acquisitionCost");
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

    if (profit >= 1000) {
      errors.push("Profit must be below $1000");
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
