import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { currentConfig } from "../config";

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
  const [attractions, setAttractions] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;
  const userID = JSON.parse(localStorage.getItem("user")).UserID;

  useEffect(() => {
    const fetchProductsAndAttractions = async () => {
      try {
        const [productsResponse, attractionsResponse] = await Promise.all([
          fetch(`${baseURL}/ticketpurchases`),
          fetch(`${baseURL}/getallattractions`),
        ]);

        if (!productsResponse.ok || !attractionsResponse.ok) {
          throw new Error("Failed to fetch products or attractions");
        }

        const [productsData, attractionsData] = await Promise.all([
          productsResponse.json(),
          attractionsResponse.json(),
        ]);

        setProducts(productsData);
        setAttractions(attractionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProductsAndAttractions();
  }, []);

  useEffect(() => {
    setSelectedAttractions(Array.from({ length: numTickets }, () => []));
  }, [numTickets]);

  const handleNumTicketsChange = (e) => {
    const num = parseInt(e.target.value);
    setNumTickets(num);
    const newTicketDetails = Array.from({ length: num }, () => ({
      ticketType: "",
      foodBundle: "",
      merchBundle: "",
    }));
    setTicketDetails(newTicketDetails);
  };

  const handleTicketDetailsChange = (index, field, value) => {
    const updatedTicketDetails = [...ticketDetails];
    updatedTicketDetails[index][field] = value;
    setTicketDetails(updatedTicketDetails);
  };

  const handleAttractionsChange = (ticketIndex, attraction, checked) => {
    setSelectedAttractions((prevAttractions) => {
      const updatedAttractions = [...prevAttractions];
      if (checked) {
        updatedAttractions[ticketIndex] = [
          ...(updatedAttractions[ticketIndex] || []),
          attraction,
        ];
      } else {
        updatedAttractions[ticketIndex] = updatedAttractions[
          ticketIndex
        ].filter((item) => item !== attraction);
      }
      return updatedAttractions;
    });
  };

  const getTotalCost = () => {
    let totalPrice = 0;
    const ticketPrices = ticketDetails.map((ticket) => {
      const ticketTypeCost = TICKET_PRICES[ticket.ticketType] || 0;
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

      totalPrice += ticketPrice;
      return ticketPrice;
    });

    setTicketPrices(ticketPrices);
    setTotalPrice(totalPrice);
    setFormSubmitted(true);
  };

  const sendAttractionsData = async () => {
    try {
      const response = await fetch(`${baseURL}/attractionlog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attractions: selectedAttractions.flat(),
          date: selectedDate,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update attraction log");
      }
      const data = await response.json();
      console.log("Attraction log updated:", data);
    } catch (error) {
      console.error("Error updating attraction log:", error);
    }
  };

  const buyTicket = async () => {
    try {
      setError(null);
      setNotification(null);
      await sendAttractionsData();

      const response = await fetch(`${baseURL}/ticketpurchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          totalPrice: Number(totalPrice.toFixed(2)),
          ticketPrices,
          ticketDetails,
          dateSelected: selectedDate,
          numTickets,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if(response.status===422){
          setError(data.message);
        }
        else{
          throw new Error("Failed to purchase tickets");
        }
      }

      if (response.status === 200 || response.status === 201) {
        if (data.message === "Discount applied successfully!") {
          const discountedTotalPrice = data.discountedTotalPrice;
          setNotification({
            message: `Congratulations! You've received a 25% discount on your purchase because you've spent $120 or more!<br><br>New total amount after discount: $${discountedTotalPrice}`,
            type: "success",
          });
        } else {
          setNotification({
            message: "Tickets successfully purchased!",
            type: "success",
          });
        }
      }
    } catch (error) {
      console.error("Error purchasing tickets:", error);
      setNotification({ message: "Failed to purchase tickets", type: "error" });
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
              <label htmlFor="dateSelected" className="form-label">
                Choose Date
              </label>
              <input
                type="date"
                className="form-control"
                id="dateSelected"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mt-2 mb-3">
                <label htmlFor="numTickets" className="form-label">
                  Number of Tickets
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="numTickets"
                  name="numTickets"
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
                    <label className="form-label">
                      Ticket {index + 1} Attractions
                    </label>
                    {attractions.map((attraction, attractionIndex) => (
                      <div
                        key={attractionIndex}
                        className="attraction-checkbox"
                      >
                        <label>
                          <input
                            type="checkbox"
                            value={attraction.NameOfAttraction}
                            checked={selectedAttractions[index]?.includes(
                              attraction.NameOfAttraction
                            )}
                            onChange={(e) =>
                              handleAttractionsChange(
                                index,
                                attraction.NameOfAttraction,
                                e.target.checked
                              )
                            }
                          />
                          <span className="attraction-name">
                            {attraction.NameOfAttraction}
                          </span>
                        </label>
                      </div>
                    ))}
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
                            {product.NameOfItem} - ${product.SalePrice} (
                            {product.Description})
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
                            {product.NameOfItem} - ${product.SalePrice} (
                            {product.Description})
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
                  Total Amount = ${totalPrice.toFixed(2)}
                </div>
                <div className="w-full px-3 text-center">
                  <button
                    className="btn btn-primary mx-auto mt-3"
                    onClick={buyTicket}
                  >
                    Confirm Purchase
                  </button>
                </div>
              </>
            )}
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
              />
            )}
            {error && (
              <div className="alert alert-danger mt-3">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
