import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import helmet from 'helmet';
import dbStart from "./config/db.js"

const app = express();
dotenv.config();

// Set Cross-Origin-Opener-Policy header to allow popups
app.use(
  helmet({
    crossOriginOpenerPolicy: 'same-origin-allow-popups',
  })
);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/api/users", userRoutes)



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})

dbStart()
