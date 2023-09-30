import express from "express";
import { getAvailableBookingTimeslots } from "../../controller/bookingController.js";

const router = express.Router();
router.get(
  "/getAvailableBookingTimeslots/:activityId/:selectedDate",
  getAvailableBookingTimeslots,
);
export default router;
