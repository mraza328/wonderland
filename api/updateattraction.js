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
      nameOfAttraction,
      attractionType,
      heightRequirementInches,
      weightRequirementPounds,
      capacity,
      attractionStatus,
      depName,
    } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    let errors = [];
    let errorFields = [];

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

    const parkClose = "19:01";
    if (endOperatingHour > parkClose) {
      errors.push(
        "End Operating Hour cannot be after when the park closes: 7PM"
      );
      if (!errorFields.includes("endOperatingHour")) {
        errorFields.push("endOperatingHour");
      }
    }

    if (attractionType !== "Ride" && attractionType !== "Show") {
      errors.push("Attraction Type must be either Ride or Show");
      errorFields.push("attractionType");
    }

    if (heightRequirementInches < 0)
      errors.push("Height Requirement must be non-negative") &&
        errorFields.push("heightRequirementInches");
    if (weightRequirementPounds < 0)
      errors.push("Weight Requirement must be non-negative") &&
        errorFields.push("weightRequirementPounds");
    if (capacity < 0)
      errors.push("Capacity must be non-negative") &&
        errorFields.push("capacity");

    if (errors.length > 0) {
      res.status(400).json({ errors, errorFields });
      return;
    }

    const updateAttractionQuery = `
      UPDATE attraction 
      SET 
        NameOfAttraction = ?,
        StartOperatingHour = ?,
        EndOperatingHour = ?,
        AttractionType = ?,
        HeightRequirementInches = ?,
        WeightRequirementPounds = ?,
        Capacity = ?,
        AttractionStatus = ?,
        DepName = ?
      WHERE NameOfAttraction = ?
    `;

    const pool = await poolPromise;
    await pool.query(updateAttractionQuery, [
      nameOfAttraction,
      startOperatingHour,
      endOperatingHour,
      attractionType,
      heightRequirementInches,
      weightRequirementPounds,
      capacity,
      "Active",
      depName,
      nameOfAttraction,
    ]);

    res.status(200).json({
      message: "Attraction updated successfully",
    });
  } catch (error) {
    console.error("Failed to update attraction:", error);
    res.status(500).json({
      message: "Failed to update attraction",
      error: error.message,
    });
  }
};
