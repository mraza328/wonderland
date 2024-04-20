import React, { useState, useEffect } from "react";
import classes from "../components/UI/Home.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { currentConfig } from "../config";

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [topAttractions, setTopAttractions] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [parkClosed, setParkClosed] = useState(false);
  const [parkInfo, setParkInfo] = useState(null);
  const baseURL = currentConfig.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);

    const formattedDate = year + "-" + month + "-" + day;

    const formData = { formattedDate };

    const fetchParkClosed = async () => {
      const response = await fetch(`${baseURL}/checkparkclosed`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch weatherlog data");
      } else {
        if (json.length > 0) {
          setParkClosed(true);
          setParkInfo(json[0]);
        }
      }
    };

    fetchParkClosed();
  }, []);

  useEffect(() => {
    fetchTopAttractions();
  }, []);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const acctType = currentUser?.AccountType;

  if (acctType == "Employee") {
    navigate("/adminLanding");
  }

  const fetchTopAttractions = async () => {
    try {
      const response = await fetch(`${baseURL}/topAttractions`);
      const data = await response.json();
      setTopAttractions(data.topAttractions);
    } catch (error) {
      console.error("Error fetching top attractions:", error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await fetch(`${baseURL}/topProducts`);
      const data = await response.json();
      setTopProducts(data.topProducts);
    } catch (error) {
      console.error("Error fetching top products:", error);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBuyTickets = () => {
    if (!currentUser) {
      window.alert("You need to sign in to access the Buy Tickets page.");
    } else {
      navigate("/ticketPurchase");
    }
  };

  return (
    <div className={classes.homepage}>
      {parkClosed ? (
        <div className={classes.error}>
          Park is closed today due to bad weather conditions:{" "}
          {parkInfo.WeatherType}
        </div>
      ) : null}
      <header>
        <h1>Welcome to Wonderland!</h1>
        <nav>
          <ul>
            <li
              onClick={() => scrollToSection("about")}
              style={{ cursor: "pointer", color: "black", fontWeight: "bold" }}
            >
              About Us
            </li>
            <li
              onClick={() => scrollToSection("attractions")}
              style={{ cursor: "pointer", color: "black", fontWeight: "bold" }}
            >
              Attractions
            </li>
            <li
              onClick={() => scrollToSection("vendors")}
              style={{ cursor: "pointer", color: "black", fontWeight: "bold" }}
            >
              Vendors
            </li>
            <li
              onClick={() => scrollToSection("tickets")}
              style={{ cursor: "pointer", color: "black", fontWeight: "bold" }}
            >
              Tickets
            </li>
            <li
              onClick={() => scrollToSection("contact")}
              style={{ cursor: "pointer", color: "black", fontWeight: "bold" }}
            >
              Contact Us
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <section id="about" className={classes.about}>
          <h2>About Wonderland</h2>
          <p>
            Wonderland was first established in 2005 by a group of young college
            students who wanted to bring joy and excitement to people's lives.
            They envisioned Wonderland as a place where dreams could come true
            and imaginations could run wild. Nestled amidst lush greenery and
            surrounded by breathtaking landscapes, Wonderland is the ultimate
            destination for thrill-seekers, families, and dreamers alike.
          </p>
          <h3>Discover Enchanting Attractions</h3>
          <p>
            Embark on a journey through our enchanting rides and events, each
            offering its own unique charm and allure. From thrilling adventures
            to whimsical experiences, Wonderland has something for everyone to
            explore and enjoy.
          </p>
          <h3>Experience Magical Entertainment</h3>
          <p>
            Witness the magic come to life with our captivating shows and
            performances. Be enchanted by spellbinding acts and dazzling
            displays that will leave you mesmerized and wanting more.
          </p>
          <h3>Indulge in Culinary Delights</h3>
          <p>
            Treat your taste buds to a culinary adventure at our fine dining
            establishments. From delicious treats to savory delights, there's no
            shortage of delectable options to satisfy your cravings and fuel
            your adventures.
          </p>
          <h3>Shop for Unforgettable Souvenirs</h3>
          <p>
            Explore our charming gift shops and take home a piece of the magic
            with themed merchandise inspired by your favorite experiences at
            Wonderland. Whether you're looking for a souvenir or a gift for a
            loved one, our shops have something for everyone to cherish.
          </p>
          <h3>Create Memories to Last a Lifetime</h3>
          <p>
            Whether you're embarking on an exciting adventure, immersing
            yourself in enchanting worlds, or simply enjoying the magical
            atmosphere, Wonderland is the perfect place to create memories that
            will last a lifetime. Join us and let your imagination soar at
            Wonderland – where the fun never ends!
          </p>
          <h3>Why Wait?</h3>
          <p>
            Don't miss out on the magic! Create an account today and unlock a
            world of possibilities for your visit to Wonderland. With your
            account, you'll gain access to exclusive benefits, including the
            ability to purchase tickets, customize your itinerary by selecting
            attractions, pre-order food, reserve merchandise, and much more.
            Start planning your unforgettable adventure now!
          </p>
        </section>
        <section id="attractions" className={classes.attraction}>
          <h2>Last Month's Most Popular Attractions</h2>
          {topAttractions.map((attraction, index) => (
            <div key={index}>
              <h3>{attraction.NameOfAttraction}</h3>
              <p>Total Riders This Past Month: {attraction.TotalRiders}</p>
            </div>
          ))}
        </section>
        <section id="vendors" className={classes.vendor}>
          <h2>Last Month's Most Popular Products</h2>
          {topProducts.map((product, index) => (
            <div key={index}>
              <h3>{product.ProductName}</h3>
              <p>Sold by: {product.VendorName}</p>
              <p>Total Sales This Past Month: {product.SalesCount}</p>
            </div>
          ))}
        </section>
        <section id="tickets" className={classes.ticket}>
          <h2>Get Your Tickets</h2>
          <div>
            <h3>General Admission</h3>
            <p>
              General Admission tickets are for all customers above the age of
              10. General Admission tickets are $60 for each day.
            </p>
          </div>
          <div>
            <h3>Kids</h3>
            <p>
              Kid tickets are for all customers between the ages of 3 and 10.
              Kid tickets are $40 for each day.
            </p>
          </div>
          <div>
            <p>
              *Note: Customers under the age of 3 have free admission to
              Wonderland*
            </p>
          </div>
          <button className={classes.button} onClick={handleBuyTickets}>
            Buy Tickets
          </button>
        </section>
        <section id="contact" className={classes.contact}>
          <h2>Contact Us</h2>
          <p>
            Have a question, suggestion, or just want to share your magical
            experience with us? We'd love to hear from you! Get in touch with
            our friendly team at wonderlandUS@gmail.com or call (111)-111-1111
            and let us make your visit even more enchanting.
          </p>
        </section>
      </main>
      <footer>
        <p>
          &copy; {new Date().getFullYear()} Wonderland Theme Park. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
