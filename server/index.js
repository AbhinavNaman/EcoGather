import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import helmet from 'helmet';

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

// Routes
// app.use("/posts", postRoutes);
// app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
// mongoose
//   .connect(process.env.CONNECTION_URL)
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
//     console.log("DB connected");
//   })
//   .catch((error) => console.log(error.message));
