import mysql from "mysql2";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const caCertificatePath = path.join(__dirname, "DigiCertGlobalRootCA.crt.pem");

export const poolPromise = (async () => {
  try {
    const caCertificate = await fs.readFile(caCertificatePath);

    const pool = mysql
      .createPool({
        host: "team8-mysql-server.mysql.database.azure.com",
        user: "team8admin",
        password: "admin-3380",
        database: "parkdb",
        ssl: {
          ca: caCertificate,
        },
      })
      .promise();

    return pool;
  } catch (error) {
    console.error("Failed to initialize the database connection pool:", error);
    throw error;
  }
})();
