import mongoose from "mongoose";
import "../loadEnvironment.js";

const connectionString = process.env.ATLAS_URI || "";

mongoose
  .connect(connectionString, { dbName: "urban_origins" })
  // .connect(connectionString)
  .then(() => console.log("MongoDb connected ..."))
  .catch((err) => console.log(err));

console.log(process.env.ATLAS_URI);
