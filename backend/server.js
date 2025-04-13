import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//routes import
import productRoutes from "./routes/productRoutes.js";

app.use(express.json());
app.use(cors());
app.use(helmet()); //helmet is a security package which will be used to add security headers
app.use(morgan("dev")); //used to log requestes

//apply arcjet rate limitint to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too many requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    //check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
    }
    next();
  } catch (err) {
    console.log("Arcjet error", err);
    next(err);
  }
});

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
