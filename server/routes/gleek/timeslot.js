import express from "express";
import {
  getBlockedTimeslotsByActivityId,
  addBlockedTimeslot,
} from "../../controller/blockedTimeslotController.js";

const router = express.Router();

// Blocked Timeslots
router.get(
  "/getBlockedTimeslotsByActivityId/:activityId",
  getBlockedTimeslotsByActivityId
);
router.post("/addBlockedTimeslot", addBlockedTimeslot);

export default router;
