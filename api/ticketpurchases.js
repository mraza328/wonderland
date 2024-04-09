import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const pool = await poolPromise;

    const productQuery = `
      SELECT p.ItemID, p.NameOfItem, p.SalePrice, v.VendorType
      FROM Product p
      INNER JOIN Vendor v ON p.NameOfVendor = v.NameOfVendor
      `;

    const [productResults] = await pool.query(productQuery);
    const products = productResults;

    if (req.method === "GET") {
      res.status(200).json(products);
    } else if (req.method === "POST") {
      const { userID, totalPrice, ticketPrices, ticketDetails, dateSelected } =
        await new Promise((resolve, reject) => {
          let body = "";
          req.on("data", (chunk) => (body += chunk.toString()));
          req.on("end", () => {
            resolve(JSON.parse(body));
          });
          req.on("error", (err) => reject(err));
        });

      const currentDate = new Date().toISOString().slice(0, 10);

      // Insert sale into the database
      const saleQuery =
        "INSERT INTO Sale (UserID, TotalPrice, DateSold, DateValid) VALUES (?, ?, ?, ?)";
      const [saleResults] = await pool.query(saleQuery, [
        userID,
        totalPrice,
        currentDate,
        dateSelected,
      ]);

      const saleId = saleResults.insertId;

      // Insert tickets into the database
      const ticketQuery =
        "INSERT INTO Ticket (SaleID, TicketType, FoodItemID, MerchItemID, TicketPrice) VALUES (?, ?, ?, ?, ?)";
      for (let i = 0; i < ticketDetails.length; i++) {
        const ticket = ticketDetails[i];
        const { ticketType, foodBundle, merchBundle } = ticket;
        let foodItemID = null;
        let merchItemID = null;
        if (foodBundle !== "None") {
          const selectedFood = products.find(
            (product) => product.NameOfItem === foodBundle
          );
          if (selectedFood) {
            foodItemID = selectedFood.ItemID;
          }
        }
        if (merchBundle !== "None") {
          const selectedMerch = products.find(
            (product) => product.NameOfItem === merchBundle
          );
          if (selectedMerch) {
            merchItemID = selectedMerch.ItemID;
          }
        }
        const ticketPrice = ticketPrices[i];
        await pool.query(ticketQuery, [
          saleId,
          ticketType,
          foodItemID,
          merchItemID,
          ticketPrice,
        ]);
      }

      // Select DiscountApplied for the newly inserted sale
      const selectDiscountAppliedQuery =
        "SELECT DiscountApplied FROM Sale WHERE SaleID = ?";
      const [discountAppliedRows] = await pool.query(
        selectDiscountAppliedQuery,
        [saleId]
      );

      // Check if DiscountApplied is set to 1
      const discountApplied = discountAppliedRows[0]?.DiscountApplied === 1;

      if (discountApplied) {
        res.status(201).json({
          message: "Discount applied successfully!",
          saleId,
        });
      } else {
        res.status(200).json({
          message: "Ticket purchase processed successfully",
          saleId,
        });
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      message: "Error processing ticket purchase",
      error: error.message,
    });
  }
};
