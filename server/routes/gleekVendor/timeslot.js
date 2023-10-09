import express from "express";
import {
  getBlockedTimeslotsByActivityId,
  addBlockedTimeslot,
  addBlockedTimeslotMultipleActivities,
  deleteBlockedTimeslot,
} from "../../controller/blockedTimeslotController.js";
import vendorVerifyToken from "../../middleware/vendorAuth.js";

const router = express.Router();

/**
 *  Blocked Timings
 */

/**
 * GET /gleekVendor/timeslot/blockout/activity/:activityId
 * Get Blocked Timeslots by Activity ID
 *
 *
 */
router.get("/blockout/activity/:activityId", getBlockedTimeslotsByActivityId);

/**
 * POST /gleekVendor/timeslot/blockout/activity
 * Add 1 blockout timeslot to 1 activity
 * Request body expects:
{
  "activityId": "60b9a9f9f0a6a93c4c0e4e8d",
  "blockedStartDateTime": "2021-06-06T00:00:00.000Z",
  "blockedEndDateTime": "2021-06-06T01:00:00.000Z"
 */
router.post("/blockout/activity", vendorVerifyToken, addBlockedTimeslot);

/**
 * POST /gleekVendor/timeslot/blockout/activities
 * Add 1 blockout timeslot to 1 or several activities
 */
router.post(
  "/blockout/activities",
  vendorVerifyToken,
  addBlockedTimeslotMultipleActivities,
);

/**
 * DELETE /gleekVendor/timeslot/blockout/:blockedTimingId
 * Delete 1 blockedTiming record
 */
router.delete(
  "/blockout/:blockedTimingId",
  vendorVerifyToken,
  deleteBlockedTimeslot,
);
export default router;
