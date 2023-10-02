import express from "express";
import {
  getAvailableBookingTimeslots,
  createBooking,
} from "../../controller/bookingController.js";

const router = express.Router();

// Booking
router.get(
  "/getAvailableBookingTimeslots/:activityId/:selectedDate",
  getAvailableBookingTimeslots
);
router.post("/createBooking", createBooking);

export default router;
