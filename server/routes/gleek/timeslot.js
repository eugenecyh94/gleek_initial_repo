import express from "express";
import {
  getBlockedTimeslotsByActivityId,
  addBlockedTimeslot,
  addBlockedTimeslotMultipleActivities,
} from "../../controller/blockedTimeslotController.js";
import verifyToken from "../../middleware/vendorAuth.js";

const router = express.Router();

// Blocked Timeslots
router.get(
  "/getBlockedTimeslotsByActivityId/:activityId",
  getBlockedTimeslotsByActivityId
);
router.post("/addBlockedTimeslot", verifyToken, addBlockedTimeslot);

// Add 1 blockout timeslot to 1 or several activities
router.post("/blockout/activities", verifyToken, addBlockedTimeslotMultipleActivities);


export default router;
