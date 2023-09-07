import express from "express";
import cors from "cors";
import "./loadEnvironment.js";
import "./database/urbanOriginsDb.js";
import activityController from "./controller/activityController.js";
import userController from "./controller/userController.js";
import authController from "./controller/authController.js";
import gleekRoutes from "./routes/gleek/gleek.js";
import cookieParser from "cookie-parser";
const app = express();

const port = process.env.PORT;
// Custom middleware to apply different CORS options based on the origin
const customCors = (req, callback) => {
  const whitelist = ["http://localhost:3001", "http://localhost:3002"];
  const origin = req.header("Origin");

  if (whitelist.includes(origin)) {
    // Apply credentials: true for http://localhost:3001
    const corsOptions = {
      origin,
      credentials: origin === "http://localhost:3001",
    };
    callback(null, corsOptions);
  } else {
    // Disallow CORS for other origins
    callback();
  }
};

app.use(cors(customCors));

app.use(cookieParser());

app.use(express.json());

app.use("/activity", activityController);
app.use("/users", userController);
app.use("/auth", authController);

app.use("/gleek", gleekRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
