import React, { useState, useEffect } from "react";

const TICKET_PRICES = {
  GA: 60,
  KI: 40,
};

export default function TicketPurchase() {
  const [numTickets, setNumTickets] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [ticketDetails, setTicketDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketPrices, setTicketPrices] = useState([]);

  const userID = JSON.parse(localStorage.getItem("user")).UserID;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/ticketPurchase");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleNumTicketsChange = (e) => {
    const num = parseInt(e.target.value);
    setNumTickets(num);
    const newTicketDetails = [];
    for (let i = 0; i < num; i++) {
      newTicketDetails.push({
        ticketType: "",
        foodBundle: "",
        merchBundle: "",
      });
    }
    setTicketDetails(newTicketDetails);
  };

  const handleTicketDetailsChange = (index, field, value) => {
    const updatedTicketDetails = [...ticketDetails];
    updatedTicketDetails[index][field] = value;
    setTicketDetails(updatedTicketDetails);
  };

  const getTotalCost = () => {
    let totalPrice = 0;
    const ticketPrices = []; // Array to store individual ticket prices

    ticketDetails.forEach((ticket) => {
      const ticketTypeCost = TICKET_PRICES[ticket.ticketType];
      let ticketPrice = ticketTypeCost;

      const selectedFood = products.find(
        (product) => product.NameOfItem === ticket.foodBundle
      );
      if (selectedFood && ticket.foodBundle !== "None") {
        ticketPrice += parseFloat(selectedFood.SalePrice);
      }

      const selectedMerch = products.find(
        (product) => product.NameOfItem === ticket.merchBundle
      );
      if (selectedMerch && ticket.merchBundle !== "None") {
        ticketPrice += parseFloat(selectedMerch.SalePrice);
      }

      totalPrice += ticketPrice; // Add ticket price to total price
      ticketPrices.push(ticketPrice); // Add ticket price to the array
    });

    console.log(ticketPrices);
    setTicketPrices(ticketPrices);
    setTotalPrice(totalPrice);
    setFormSubmitted(true);
  };

  const buyTicket = async () => {
    try {
      const response = await fetch("http://localhost:3001/ticketPurchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          totalPrice,
          ticketPrices,
          ticketDetails,
          purchaseDate: selectedDate,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to purchase tickets");
      }

      const data = await response.json();

      if (data.discountApplied) {
        alert(
          `Congratulations! You've received a 25% discount on your purchase because you've spent $120 or more!\n\nDiscount applied: $${data.discountAmount.toFixed(
            2
          )}\nNew total: $${data.newTotal.toFixed(2)}`
        );
      } else {
        alert("Tickets have been purchased!");
      }
    } catch (error) {
      console.error("Error purchasing tickets:", error);
      alert("Failed to purchase tickets");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col md-4 mb-4">
        <div className="card sign-up">
          <div className="card-body">
            <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
              Purchase Tickets
            </h1>
            <div className="text-center">
              General Admission Tickets (GA): $60, for all customers above 10
              years old
            </div>
            <div className="text-center">
              Kid Tickets (KI): $40, for all customers between 3 and 10 years
              old
            </div>
            <div className="text-center">
              **Customers under the age of 3 do not need a ticket and have free
              admission to Wonderland.
            </div>
            <div className="mt-2 mb-3">
              <label htmlFor="purchaseDate" className="form-label">
                Choose Date
              </label>
              <input
                type="date"
                className="form-control"
                id="purchaseDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mt-2 mb-3">
                <label htmlFor="numOfTickets" className="form-label">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="numOfTickets"
                  name="numOfTickets"
                  placeholder="0"
                  value={numTickets}
                  onChange={handleNumTicketsChange}
                  min="0"
                  maxLength="10"
                  required
                />
              </div>
              {ticketDetails.map((ticket, index) => (
                <div key={index}>
                  {index > 0 && <hr style={{ borderTop: "4px solid black" }} />}{" "}
                  {/* Horizontal line */}
                  <div className="mt-2 mb-3">
                    <label
                      htmlFor={`ticketType${index}`}
                      className="form-label"
                    >
                      Ticket Type {index + 1}
                    </label>
                    <select
                      className="form-control"
                      id={`ticketType${index}`}
                      name={`ticketType${index}`}
                      value={ticket.ticketType}
                      onChange={(e) =>
                        handleTicketDetailsChange(
                          index,
                          "ticketType",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">Select Ticket Type</option>
                      <option value="GA">General Admission (GA)</option>
                      <option value="KI">Kid (KI)</option>
                    </select>
                  </div>
                  <div className="mt-2 mb-3">
                    <label
                      htmlFor={`foodBundle${index}`}
                      className="form-label"
                    >
                      Food Bundle {index + 1}
                    </label>
                    <select
                      className="form-control"
                      id={`foodBundle${index}`}
                      value={ticket.foodBundle}
                      onChange={(e) =>
                        handleTicketDetailsChange(
                          index,
                          "foodBundle",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="" disable hidden>
                        Select Food Bundle
                      </option>
                      <option value="None">None</option>
                      {products
                        .filter((product) => product.VendorType === "Food")
                        .map((product) => (
                          <option
                            key={product.ItemID}
                            value={product.NameOfItem}
                          >
                            {product.NameOfItem} - ${product.SalePrice}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mt-2 mb-3">
                    <label
                      htmlFor={`merchBundle${index}`}
                      className="form-label"
                    >
                      Merch Bundle {index + 1}
                    </label>
                    <select
                      className="form-control"
                      id={`merchBundle${index}`}
                      value={ticket.merchBundle}
                      onChange={(e) =>
                        handleTicketDetailsChange(
                          index,
                          "merchBundle",
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="" disabled hidden>
                        Select Merch Bundle
                      </option>
                      <option value="None">None</option>
                      {products
                        .filter(
                          (product) => product.VendorType === "Merchandise"
                        )
                        .map((product) => (
                          <option
                            key={product.ItemID}
                            value={product.NameOfItem}
                          >
                            {product.NameOfItem} - ${product.SalePrice}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3 text-center">
                  <button
                    id="button"
                    type="button"
                    className="btn btn-primary"
                    onClick={getTotalCost}
                  >
                    Get Total Cost
                  </button>
                </div>
              </div>
            </form>
            {formSubmitted && (
              <>
                <div className="text-center text-white mt-3">
                  Total Amount = ${totalPrice}
                </div>
                <div className="w-full px-3 text-center">
                  <button
                    className="btn btn-primary mx-auto mt-3"
                    onClick={buyTicket}
                  >
                    Purchase
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
