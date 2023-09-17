import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "./database/urbanOriginsDb.js";
import "./loadEnvironment.js";
import gleekRoutes from "./routes/gleek/gleek.js";
import activityRoutes from "./routes/gleekAdmin/activityRoute.js";
import gleekAdminRoutes from "./routes/gleekAdmin/gleekAdmin.js";
import vendorRoutes from "./routes/gleekAdmin/vendorRoute.js";
import client from "./routes/gleekAdmin/client.js";

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
         credentials: true,
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

app.use("/gleekAdmin", gleekAdminRoutes);
app.use("/vendor", vendorRoutes);
app.use("/activity", activityRoutes);
app.use("/client", client);

app.use("/gleek", gleekRoutes);

app.listen(port, () => {
   console.log(`Server is running on port: ${port}`);
});
