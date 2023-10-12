import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "./database/urbanOriginsDb.js";
import "./loadEnvironment.js";
import gleekRoutes from "./routes/gleek/gleek.js";
import activityRoutes from "./routes/gleekAdmin/activityRoute.js";
import gleekAdminRoutes from "./routes/gleekAdmin/gleekAdmin.js";
import gleekVendorRoutes from "./routes/gleekVendor/gleekVendor.js";
import vendorRoutes from "./routes/gleekAdmin/vendorRoute.js";
import bookingRoutes from "./routes/gleekAdmin/bookingRoute.js";
import client from "./routes/gleekAdmin/client.js";
import activityTestController from "./controller/activityTestController.js";
import notificationRoutes from "./routes/notificationRoute.js";
import pdf from "html-pdf";
import { InvoiceTemplate } from "./assets/templates/InvoiceTemplate.js";

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
app.use("/booking", bookingRoutes);

/**
 * For Client application
 */
app.use("/gleek", gleekRoutes);

/**
 * For Vendor application
 */
app.use("/gleekVendor", gleekVendorRoutes);
//for activity image upload test
app.use("/testActivity", activityTestController);
app.use("/notification", notificationRoutes);

app.get("/pdf", (req, res, next) => {
  const booking = {
    client: {
      name: "Yunus",
    },
    startDateTime: "2023-10-20T01:00:00.000+00:00",
    endDateTime: "2023-10-20T04:00:00.000+00:00",
    totalCost: 900,
    totalPax: 20,
    activityTitle: "Coffee Grounds",
    vendorName: "Sustainability Project",
    status: "PENDING_CONFIRMATION",
    billingAddress: "test",
    billingPostalCode: "1",
  };

  pdf.create(InvoiceTemplate(booking), {}).toStream(function (err, stream) {
    res.setHeader("Content-Type", "appplication/pdf");
    res.setHeader("Content-Disposition", "inline;filename=test.pdf");
    stream.pipe(res);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
