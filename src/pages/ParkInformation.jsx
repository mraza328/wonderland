import React, { useRef } from "react";
import classes from "../components/UI/Home.module.css";

//alerts for temporarily closure shows up first, then today's park hours, and so on
export default function ParkInformation() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className={classes.homepage}>
      <header>
        <h1>Park Information</h1>
        <nav>
          <ul>
            <li
              onClick={() => scrollToSection("accessibility")}
              style={{ cursor: "pointer", color: "black", fontWeight: "bold" }}
            >
              Safety and Accessibility
            </li>

            <li
              onClick={() => scrollToSection("parking")}
              style={{ cursor: "pointer", color: "black", fontWeight: "bold" }}
            >
              Parking Information
            </li>

            <li
              onClick={() => scrollToSection("policy")}
              style={{ cursor: "pointer", color: "black", fontWeight: "bold" }}
            >
              Park Policy
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="accessibility" className={classes.about}>
          <h2>Making Things Work For Everyone</h2>
          <p>
            Here at Wonderland, we understand the importance of accessibility,
            which is why we've taken measures to provide inclusive environments
            and accessible experiences for everyone. From wheelchair-friendly
            pathways to specialized services, we're committed to making sure
            that all visitors can fully enjoy all that our park has to offer
            while prioritizing safety above all else.
          </p>
          <h3>Wheelchair Accessibility</h3>
          <p>
            At Wonderland, our park is wheelchair accessible, with ramps and
            wide pathways for easy navigation. Wheelchair users can enter the
            park without encountering any barriers. Furthermore, some of our
            attractions are wheelchair accessible. Please contact us at
            wonderlandUS@gmail.com or call (111)-111-1111 for specific
            accessibility information for each attraction.
          </p>
          <p>
            Furthermore, we offer wheelchair rentals for visitors who require
            mobility assistance during their visit to our theme park. Our
            wheelchairs are designed for comfort and ease of use, providing a
            convenient solution for visitors with mobility challenges.
            Wheelchair rentals are available at designated locations near the
            park entrance. Our magical staff here at Wonderland will assist you
            in selecting the appropriate wheelchair and completing the rental
            process.
          </p>
          <h3>Service Animals</h3>
          <p>
            Service animals are welcome here at Wonderland under the care of
            their owner. However, we ask that all visitors with service animals
            check in with their service animal before entering the park. Service
            animals must remain under their owner’s control at all times.
          </p>
          <h3>Ride Requirements</h3>
          <p>
            Your safety is our top priority at Wonderland. While our rides and
            attractions are designed to provide magical experiences for our
            visitors to enjoy, it’s important to read the safety information at
            each attraction so that you can make an informed decision about your
            ability to safely and conveniently experience everything that
            Wonderland has to offer.
          </p>
          <p>
            Unless otherwise stated, visitors must be 48" or taller in order to
            ride most rides. Additionally, for most rides and attractions,
            visitors must be able to independently maintain an upright position,
            and brace and support your torso, neck, and head while absorbing
            sudden and dramatic movements throughout the experience.
          </p>
          <p>
            Furthermore, all passenger restraint systems, including lap bars,
            shoulder harnesses, and seat belts must be positioned and fastened
            properly to assure rider safety. Visitors who do not fit properly
            within any safety restraint will not be permitted to ride. As such,
            visitors are strongly encouraged to try the test seats provided at
            the entrance of the attractions to ensure their ability to ride.
          </p>
          <p>
            If you have any questions, feel free to speak to an attendant at the
            attraction or contact us at wonderlandUS@gmail.com or call
            (111)-111-1111.
          </p>
        </section>

        <section id="parking" className={classes.about}>
          <h2>Parking Information</h2>
          <p>
            Our theme park has four parking lots, three of which are accessible
            for all visitors. Please see your parking options listed below!
          </p>

          <h3>Parking Zone A - Premium Parking</h3>
          <p>
            Parking Zone A is our premium parking area, offering shaded parking
            spots closest to the entrance. It's the ideal choice for visitors
            seeking convenience and comfort. While parking here comes at a
            premium, you'll enjoy the benefit of quick access to the park,
            making it perfect for those who prioritize ease of entry.
          </p>
          <p>Parking in this zone costs $30 per day.</p>

          <h3>Parking Zone B - Free Parking</h3>
          <p>
            Parking Zone B is our largest parking area and it's completely free!
            Although it's not as close to the entrance as Zone A, it provides
            ample space for parking and is still within a reasonable walking
            distance to the park.
          </p>

          <h3>Parking Zone C - Free Parking</h3>
          <p>
            Parking Zone C is a smaller free parking area, located slightly
            further from the entrance compared to Zones A and B. While it may
            not offer as many parking spots, it's still a viable choice for
            visitors looking for complimentary parking options.
          </p>

          <h3>Parking Zone D - Employees Only</h3>
          <p>
            Please note that Zone D is reserved exclusively for employees of the
            theme park. This ensures that our staff have convenient parking
            access while they work hard to make your visit enjoyable.
          </p>
        </section>

        <section id="policy" className={classes.about}>
          <h2>Park Policy</h2>
          <p>
            Safety First: The safety of our visitors is our top priority. Please
            adhere to all posted safety instructions, including height and age
            restrictions on rides and attractions.
          </p>
          <p>
            Respectful Behavior: Treat fellow visitors, staff, and property with
            respect and kindness. Any form of harassment, discrimination, or
            disruptive behavior will not be tolerated and may result in removal
            from Wonderland.
          </p>
          <p>
            Queue Etiquette: Respect the queue lines and follow instructions
            from park staff. Line cutting or saving spots for others is not
            permitted.
          </p>
          <p>
            Prohibited Items: For the safety of other visitors here at
            Wonderland, glass containers, weapons, alcohol, bikes, scooters,
            skates and skateboards, rollerblades, and smoking/vaping are not
            allowed. Furtermore, outside food, drink, and coolers are NOT
            allowed to be brought into Wonderland.
          </p>
          <p>
            Photography and Videography: Visitors are welcome to take photos and
            videos for personal use only. Commercial photography or videography
            requires prior authorization from park management.
          </p>
          <p>
            Lost and Found: Report any lost items to Guest Services. Found items
            should be turned in to visitor Services as well.
          </p>
          <p>
            Parental Supervision: Children under a certain age must be
            accompanied by an adult at all times. Please refer to posted signage
            for age-specific guidelines.
          </p>
          <p>
            Park Hours: Adhere to park operating hours. Visitors must exit the
            park premises promptly at closing time.
          </p>
          <p>
            No Outside Food or Beverages: With the exception of infant formula
            or special dietary needs, outside food and beverages are not allowed
            within the park. However, picnic areas are available outside the
            park for your convenience.
          </p>
          <p>
            Park Policies: Additional park policies may be posted or
            communicated verbally by park staff. Please comply with all
            instructions for a safe and enjoyable experience.
          </p>
        </section>
      </main>
    </div>
  );
}
