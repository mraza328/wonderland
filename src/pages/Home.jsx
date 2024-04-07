import React from "react";
import classes from "../components/UI/Home.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const acctType = currentUser?.AccountType;

  if (acctType == "Employee") {
    navigate("/AdminLanding");
  }

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
            students who wanted to bring a splash of color to the world. They
            dreamed that Wonderland would allow dreams to become reality and
            wishes to come true. At Wonderland, imagination knows no bounds!
            Step into a world where fantasy becomes reality, and every corner
            holds a new adventure waiting to be discovered. Nestled amidst lush
            greenery and surrounded by breathtaking landscapes, Wonderland is
            the ultimate destination for thrill-seekers, families, and dreamers
            alike.
          </p>
          <h3>Discover Enchanting Attractions</h3>
          <p>
            Embark on a journey through our enchanting rides and events, each
            with its own unique charm and allure. From the mystical wonders of
            the "Legendary Arena," where mythical creatures roam free, to the
            adrenaline-pumping ride, "Thrillseeker's Torment," there's something
            for everyone to explore and enjoy.
          </p>
          <h3>Experience Magical Entertainment</h3>
          <p>
            Experience the magic come to life with our captivating show,
            "Enchanted Theater". Be mesmerized by spellbinding performances
            where acrobats, magicians, and dancers dazzle audiences with their
            talents. Join in on the fun with interactive shows, parades, and
            character meet-and-greets that will leave you smiling from ear to
            ear.
          </p>
          <h3>Indulge in Culinary Delights</h3>
          <p>
            Take a break from the excitement and indulge in a culinary adventure
            at one of our fine dining establishments. From mouthwatering treats
            to savory delights, there's no shortage of delectable options to
            satisfy your cravings and fuel your adventures.
          </p>
          <h3>Shop for Unforgettable Souvenirs</h3>
          <p>
            Don't forget to visit our mesmerizing gift shops scattered
            throughout Wonderland! Take home a piece of the fun with a wide
            array of themed merchandise inspired by your favorite attractions
            and characters. Whether you're searching for the perfect memento or
            a magical gift for a loved one, our gift shops have something for
            everyone to treasure.
          </p>
          <h3>Create Memories to Last a Lifetime</h3>
          <p>
            Whether you're embarking on a thrilling quest, exploring enchanted
            realms, or simply soaking in the magical atmosphere, Wonderland is
            the perfect place to create memories that will last a lifetime. Join
            us and let your imagination run wild at Wonderland – where the fun
            never ends!
          </p>
        </section>
        <section id="attractions" className={classes.attraction}>
          <h2>Popular Attractions</h2>
          <div>
            <h3>Legendary Arena</h3>
            <img
              src="https://www.ocregister.com/wp-content/uploads/2019/10/silver-dollar-city-mystic-rivers-falls-1.jpg?w=750"
              alt="Legendary Arena"
            />
            <p>
              Lengendary Arena is an exhilarating journey through the heart of
              mythical battles and legendary creatures. As riders traverse the
              arena, they are transported to a realm where ancient legends come
              to life. The ride includes a dramatic entrance into a grand
              coliseum, adorned with towering statues of legendary warriors and
              mythical beasts.
            </p>
          </div>
          <div>
            <h3>Thrillseeker's Torment</h3>
            <img
              src="https://assets3.thrillist.com/v1/image/3130699/1200x630/flatten;crop_down;webp=auto;jpeg_quality=70"
              alt="Thrillseeker's Tormet"
            />
            <p>
              Thrillseeker's Torment is a heart-pounding roller coaster ride
              that takes daring adventurers on a wild journey through loops,
              drops, and unexpected twists. Brace yourself for an
              adrenaline-fueled experience that will leave you breathless and
              begging for more.
            </p>
          </div>
          <div>
            <h3>Enchanted Theater</h3>
            <img
              src="https://www.themeparktourist.com/files/u235/Shows/5_13_DL_05240_.jpg"
              alt="Enchanted Theater"
            />
            <p>
              Enchanted Theater is a mesmerizing magic show that transports
              audiences into a world of wonder and amazement. Set in a mystical
              theater filled with enchanting illusions and spellbinding
              performances, this captivating spectacle brings dreams to life
              before your very eyes. Prepare to be dazzled by mind-bending
              tricks, mysterious disappearances, and the uncanny abilities of
              masterful magicians.
            </p>
          </div>
        </section>
        <section id="vendors" className={classes.vendor}>
          <h2>Popular Vendors</h2>
          <div>
            <h3>Adventure Bites Eatery</h3>
            <img
              src="https://www.themeparkinsider.com/photos/images/tiffins.jpg"
              alt="Adventure Bites Eatery"
            />
            <p>
              Adventure Bites Eatery is your ultimate dining destination in the
              heart of Wonderland. Fuel up for your next adventure with a
              tantalizing array of flavors from around the world. From
              mouthwatering burgers to delicious pizza, our diverse menu
              promises something to satisfy every appetite. Enjoy your meal in a
              vibrant and energetic atmosphere that captures the spirit of
              adventure. At Adventure Bites Eatery, every bite is a journey
              worth savoring.
            </p>
          </div>
          <div>
            <h3>Fantasy Finds Boutique</h3>
            <img
              src="https://buschgardens.com/tampa/-/media/busch-gardens-tampa/other-modules/490x225/shops/emporium/2017_buschgardenstampabay_shops_emporium2_490x225.ashx"
              alt="Fantasy Finds Boutique"
            />
            <p>
              Fantasy Finds Boutique is a whimsical treasure trove nestled
              within the theme park, offering a delightful array of enchanted
              souvenirs and magical mementos. From whimsical trinkets to
              fantastical keepsakes, every item beckons with the promise of
              adventure and imagination. Step inside and embark on a journey
              through a realm of wonder, where each discovery brings a spark of
              joy and enchantment.
            </p>
          </div>
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
