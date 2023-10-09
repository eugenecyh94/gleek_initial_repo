import express from "express";
import {
  getAvailableBookingTimeslots,
  createBooking,
} from "../../controller/bookingController.js";
import { verifyToken } from "../../middleware/clientAuth.js";

const router = express.Router();

// Booking
router.get(
  "/getAvailableBookingTimeslots/:activityId/:selectedDate",
  verifyToken,
<<<<<<< HEAD
  getAvailableBookingTimeslots
=======
  getAvailableBookingTimeslots,
>>>>>>> develop-2
);
router.post("/createBooking", verifyToken, createBooking);

export default router;
