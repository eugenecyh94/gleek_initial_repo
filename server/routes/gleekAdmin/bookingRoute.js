import express from "express";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  deleteBooking,
  getAllBookingsByActivityId,
} from "../../controller/bookingController.js";

const router = express.Router();
router.get("/getAllBookings", getAllBookings);
router.get("/getBookingById/:id", getBookingById);
router.get(
  "/getAllBookingsByActivityId/:activityId",
  getAllBookingsByActivityId,
);
router.post("/createBooking", createBooking);
router.delete("/deleteBooking/:id", deleteBooking);
export default router;
