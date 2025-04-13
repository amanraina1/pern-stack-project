import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//routes import
import productRoutes from "./routes/productRoutes.js";

app.use(express.json());
app.use(cors());
app.use(helmet()); //helmet is a security package which will be used to add security headers
app.use(morgan("dev")); //used to log requestes

app.use("/api/products", productRoutes);

async function initDb() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    console.log("Initialize Database successfully...");
  } catch (error) {
    console.log("Error connecting database : ", error);
  }
}

initDb().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running at port: ", PORT);
  });
});
