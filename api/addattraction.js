import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
      startOperatingHour,
      endOperatingHour,
      name,
      type,
      height,
      weight,
      capacity,
      status: attractionStatus,
      department: depName,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    // Validations
    let errors = [];
    let errorFields = [];

    if(!name){
      errors.push("Name is required.");
      errorFields.push("name");
    }

    if (name.length > 100) {
      errors.push("Name must be 100 characters or less");
      errorFields.push("name");
    }

    // Operating hours validation
    if (startOperatingHour >= endOperatingHour) {
      errors.push("Start Operating Hour should be before End Operating Hour");
      errorFields.push("startOperatingHour", "endOperatingHour");
    }

    const parkOpen = "09:00";
    if (startOperatingHour < parkOpen) {
      errors.push(
        "Start Operating Hour cannot be before when the park opens: 9AM"
      );
      if (!errorFields.includes("startOperatingHour")) {
        errorFields.push("startOperatingHour");
      }
    }

    const parkClose = "19:00";
    if (endOperatingHour > parkClose) {
      errors.push(
        "End Operating Hour cannot be after when the park closes: 7PM"
      );
      if (!errorFields.includes("endOperatingHour")) {
        errorFields.push("endOperatingHour");
      }
    }

    // Type validation
    if (type !== "Ride" && type !== "Show") {
      errors.push("Attraction Type must be either Ride or Show");
      errorFields.push("type");
    }

    // Numeric validations
    if (height < 0)
      errors.push("Height Requirement must be non-negative") &&
        errorFields.push("height");
    if (weight < 0)
      errors.push("Weight Requirement must be non-negative") &&
        errorFields.push("weight");
    if (capacity < 0)
      errors.push("Capacity must be non-negative") &&
        errorFields.push("capacity");

    if(height >= 100)
    {
      errors.push("Height Requirement must be below 100 inches");
      errorFields.push("height")
    }
    if(weight >= 1000)
    {
      errors.push("Weight Requirement must be below 1000 pounds");
      errorFields.push("weight")
    }

    if (errors.length > 0) {
      res.status(400).json({ errors, errorFields });
      return;
    }

    // Database insertion
    const attractionQuery = `
      INSERT INTO Attraction (
        NameOfAttraction,
        StartOperatingHour,
        EndOperatingHour,
        AttractionType,
        HeightRequirementInches,
        WeightRequirementPounds,
        Capacity,
        AttractionStatus,
        DepName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const pool = await poolPromise;
    await pool.query(attractionQuery, [
      name,
      startOperatingHour,
      endOperatingHour,
      type,
      height,
      weight,
      capacity,
      attractionStatus,
      depName,
    ]);

    res.status(201).json({
      message: "Attraction added successfully",
    });
  } catch (error) {
    console.error("Failed to add attraction:", error);
    res.status(500).json({
      message: "Failed to add attraction",
      error: error.message,
    });
  }
};
