import express from "express";
import {
  getAllBookings,
  getBookingById,
  deleteBooking,
  getAllBookingsByActivityId,
} from "../../controller/bookingController.js";

const router = express.Router();
router.get("/getAllBookings", getAllBookings);
router.get("/getBookingById/:id", getBookingById);
router.get(
  "/getAllBookingsByActivityId/:activityId",
<<<<<<< HEAD
  getAllBookingsByActivityId
=======
  getAllBookingsByActivityId,
>>>>>>> develop-2
);
router.delete("/deleteBooking/:id", deleteBooking);
export default router;
