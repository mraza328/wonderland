import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      ItemID, //ignored
      NameOfItem,
      NameOfVendor,
      AcquisitionCost,
      SalePrice,
      Profit, //ignored
      Description,
      ProductStatus,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    let errors = [];
    let errorFields = [];

    const profit = SalePrice - AcquisitionCost;

    if (NameOfItem.length > 100) {
        errors.push("Name must be 100 characters or less");
        errorFields.push("name");
      }
  
      if (AcquisitionCost < 0) {
        errors.push("Acquisition Cost must be non-negative");
        errorFields.push("acquisitionCost");
      }
  
      if (SalePrice < 0) {
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

    const query =  `UPDATE Product SET NameOfItem=?, NameOfVendor=?, AcquisitionCost=?, SalePrice=?, Profit=?, Description=? WHERE ProductStatus=? AND ItemID=?`;
    
    const pool = await poolPromise;
    await pool.query(query, [
        NameOfItem, 
        NameOfVendor, 
        AcquisitionCost, 
        SalePrice, 
        profit,
        Description, 
        "Active",
        ItemID
    ]);

    res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};
