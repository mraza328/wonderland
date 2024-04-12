import React, { useState, useEffect } from "react";
import { currentConfig } from "../config";

export default function PurchaseHistory() {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = currentConfig.REACT_APP_API_BASE_URL;
  const userData = JSON.parse(localStorage.getItem("user"));
  const userID = userData.UserID;

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await fetch(`${baseURL}/purchasehistory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID }), // Include userID in the request body
        });
        if (!response.ok) {
          throw new Error("Failed to fetch purchase history");
        }
        const data = await response.json();
        setPurchaseHistory(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };

    fetchPurchaseHistory();
  }, [userID, baseURL]);

  return (
    <div className="container mt-5">
      <h1 className="my-2 text-center" style={{ color: "#2F4858" }}>
        Purchase History
      </h1>
      {loading ? (
        <p className="text-center">Fetching past orders...</p>
      ) : (
        <div className="table-responsive">
          <table className="table mt-3 rounded">
            <thead>
              <tr>
                <th style={{ backgroundColor: "#86BBD8" }}>#</th>
                <th style={{ backgroundColor: "#86BBD8" }}>Date</th>
                <th style={{ backgroundColor: "#86BBD8" }}>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {purchaseHistory.map((purchase, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{purchase.date}</td>
                  <td>${purchase.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}