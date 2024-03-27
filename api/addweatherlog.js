import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { userID, dateOfClosure, weatherType, reason } = await new Promise(
      (resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk.toString()));
        req.on("end", () => resolve(JSON.parse(body)));
        req.on("error", (err) => reject(err));
      }
    );

    let errors = [];
    let errorFields = [];

    const curDate = new Date();
    const dateOfC = new Date(dateOfClosure);

    const closureYear = dateOfC.getFullYear();
    const closureMonth = dateOfC.getMonth();
    const closureDay = dateOfC.getDate() + 1;

    const currentYear = curDate.getFullYear();
    const currentMonth = curDate.getMonth();
    const currentDay = curDate.getDate();

    if (
      closureYear < currentYear ||
      (closureYear === currentYear && closureMonth < currentMonth) ||
      (closureYear === currentYear &&
        closureMonth === currentMonth &&
        closureDay < currentDay)
    ) {
      errors.push("Cannot select a previous date for field Date of Closure");
      errorFields.push("dateOfClosure");
    }

    if (
      weatherType !== "Rainy" &&
      weatherType !== "Tornado Alert" &&
      weatherType !== "Hurricane Alert" &&
      weatherType !== "Excessive Heat Watch" &&
      weatherType !== "Winter Storm" &&
      weatherType !== "Flooding" &&
      weatherType !== "Other"
    ) {
      errors.push(
        "Please select a valid weather type: Rainy, Tornado Alert, Hurricane Alert, Excessive Heat Watch, Winter Storm, Flooding, or Other"
      );
      errorFields.push("weatherType");
    }

    if (errors.length > 0) {
      res.status(400).json({ errors, errorFields });
      return;
    }

    const query = `INSERT INTO Weatherlog (UserID, DateOfClosure, WeatherType, Description) VALUES (?, ?, ?, ?)`;
      
    const pool = await poolPromise;
    const [results] = await pool.query(query, [
        userID, dateOfClosure, weatherType, reason
    ]);

    res.status(201).json({
      message: "Added to weather log successfully",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ message: "Error adding to weather log", error: error.message });
  }
};
