import express from "express";
import {
  getBlockedTimeslotsByActivityId,
  addBlockedTimeslot,
} from "../../controller/blockedTimeslotController.js";
import verifyToken from "../../middleware/vendorAuth.js";

const router = express.Router();

// Blocked Timeslots
router.get(
  "/getBlockedTimeslotsByActivityId/:activityId",
  getBlockedTimeslotsByActivityId
);
router.post("/addBlockedTimeslot", verifyToken, addBlockedTimeslot);

export default router;
