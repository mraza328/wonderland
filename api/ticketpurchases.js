import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  let products;

  try {
    // Fetch products from the database
    const pool = await poolPromise;
    const productQuery = `
      SELECT p.ItemID, p.NameOfItem, p.SalePrice, v.VendorType
      FROM Product p
      INNER JOIN Vendor v ON p.NameOfVendor = v.NameOfVendor
      `;
    const [productResults] = await pool.query(productQuery);
    const products = productResults;
    console.log("Product Data:", products);

    if (req.method === "GET") {
      res.status(200).json(products);
    } else if (req.method === "POST") {
      // Handle POST request
      const { userID, totalPrice, ticketPrices, ticketDetails, purchaseDate } =
        await new Promise((resolve, reject) => {
          let body = "";
          req.on("data", (chunk) => (body += chunk.toString()));
          req.on("end", () => {
            console.log("Request body:", body); // Log the request body
            resolve(JSON.parse(body));
          });
          req.on("error", (err) => reject(err));
        });

      // Use the promise-based pool
      const pool = await poolPromise;

      // Insert sale into the database
      const saleQuery =
        "INSERT INTO Sale (UserID, DateTimeSold, TotalPrice) VALUES (?, ?, ?)";
      const [saleResults] = await pool.query(saleQuery, [
        userID,
        purchaseDate,
        totalPrice,
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

      // Check if discount applies
      let discountApplied = false;
      let discountAmount = 0;
      let newTotal = totalPrice;

      if (totalPrice > 120) {
        discountApplied = true;
        const discountPercentage = 0.25;
        discountAmount = totalPrice * discountPercentage;
        newTotal = totalPrice - discountAmount;
      }

      res.status(200).json({
        message: "Ticket purchase processed successfully",
        saleId,
        discountApplied,
        discountAmount,
        newTotal,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      message: "Error processing ticket purchase",
      error: error.message,
    });
  }
};
