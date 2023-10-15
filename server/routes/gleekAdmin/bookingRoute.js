import express from "express";
import {
  getAllBookings,
  getBookingById,
  deleteBooking,
  getAllBookingsByActivityId,
} from "../../controller/bookingController.js";
import adminAuth from "../../middleware/adminAuth.js";

const router = express.Router();
router.get("/getAllBookings", adminAuth, getAllBookings);
router.get("/getBookingById/:id", adminAuth, getBookingById);
router.get(
  "/getAllBookingsByActivityId/:activityId",
  getAllBookingsByActivityId,
);
router.delete("/deleteBooking/:id", adminAuth, deleteBooking);
export default router;
