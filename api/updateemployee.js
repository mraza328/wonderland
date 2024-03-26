import { poolPromise } from "./database.js";

export default async (req, res) => {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const {
        UserID: userId,
        FirstName: firstName,
        MiddleName: middleName,
        LastName: lastName,
        DateOfBirth: dateOfBirth,
        PhoneNumber: phoneNumber,
        Email: email,
        Position: position,
        SupUserID: supervisorUserId,
        Salary: salary,
        DepName: department,
        ScheduleType: scheduleType,
        Street: street,
        City: city,
        State: state,
        ZipCode: zipcode,
        Status: status,
      } = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(JSON.parse(body)));
      req.on("error", (err) => reject(err));
    });

    let errors = [];
    let errorFields = [];

    const dob = new Date(dateOfBirth);
    const curDate = new Date();
    const age = Math.floor((curDate - dob) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 16) {
      errors.push(
        "Employee must be atleast 16 years old to work at Wonderland"
      );
      errorFields.push("dateOfBirth");
    }

    if (phoneNumber.length !== 10) {
      errors.push(
        "Please input a valid phone number, phone number must be 10 digits long"
      );
      errorFields.push("phoneNumber");
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email)) {
      errors.push("Please input a valid email");
      errorFields.push("email");
    }

    if (
      position !== "Employee" &&
      position !== "Maintenance" &&
      position !== "Department Manager" &&
      position !== "Admin" &&
      position !== "Park Manager"
    ) {
      errors.push(
        "Please select a valid position: Employee, Maintenance, Department Manager, or Admin"
      );
      errorFields.push("position");
    }

    if (salary < 0) {
      errors.push("Salary must be a non-negative number");
      errorFields.push("salary");
    }

    if (scheduleType !== "First Shift" && scheduleType !== "Second Shift") {
      errors.push("Please select a valid Shift: First Shift or Second Shift");
      errorFields.push("shift");
    }

    const states = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "DC",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
    ];
    if (!states.includes(state)) {
      errors.push("Please enter a valid state abbreviation");
      errorFields.push("state");
    }

    if (zipcode.length !== 5) {
      errors.push("Please enter a valid zip code, must be 5 digits long");
      errorFields.push("zipcode");
    }

    if (errors.length > 0) {
        res.status(400).json({ errors, errorFields });
        return;
    }

    const accountQuery = `UPDATE Account SET AccountType=?, FirstName=?, MiddleName=?, LastName=?, PhoneNumber=?, DateOfBirth=?, Email=? WHERE UserID=?`;
    const employeeQuery =`UPDATE Employee Set FirstName=?, LastName=?, PhoneNumber=?, Email=?, Position=?, SupUserID=?, Salary=?, Street=?, City=?, State=?, ZipCode=?, Status=?, DepName=?, ScheduleType=? WHERE UserID=?`;

    const pool = await poolPromise;
    await pool.query(accountQuery, [
        position,
        firstName,
        middleName,
        lastName,
        phoneNumber,
        dateOfBirth,
        email,
        userId,
    ]);

    await pool.query(employeeQuery, [
        firstName,
            lastName,
            phoneNumber,
            email,
            position,
            supervisorUserId,
            salary,
            street,
            city,
            state,
            zipcode,
            status,
            department,
            scheduleType,
            userId,
    ]);

    res.status(200).json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Failed to update employee:", error);
    res.status(500).json({
      message: "Failed to update employee",
      error: error.message,
    });
  }
};
