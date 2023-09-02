import express from "express";
import cors from "cors";
import "./loadEnvironment.js";
import "./database/urbanOriginsDb.js";
import activityController from "./controller/activityController.js";
import userController from "./controller/userController.js";
import authController from "./controller/authController.js";

const app = express();

const port = process.env.PORT;

app.use(cors());

app.use(express.json());

app.use("/activity", activityController);
app.use("/users", userController);
app.use("/auth", authController);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
