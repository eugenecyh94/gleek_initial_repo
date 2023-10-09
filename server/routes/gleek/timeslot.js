import express from "express";
import {
  getBlockedTimeslotsByActivityId,
  addBlockedTimeslot,
<<<<<<< HEAD
} from "../../controller/blockedTimeslotController.js";
import verifyToken from "../../middleware/vendorAuth.js";

const router = express.Router();

// Blocked Timeslots
router.get(
  "/getBlockedTimeslotsByActivityId/:activityId",
  getBlockedTimeslotsByActivityId
);
router.post("/addBlockedTimeslot", verifyToken, addBlockedTimeslot);
=======
  addBlockedTimeslotMultipleActivities,
} from "../../controller/blockedTimeslotController.js";
import vendorVerifyToken from "../../middleware/vendorAuth.js";

const router = express.Router();

// // Blocked Timeslots
// router.get(
//   "/getBlockedTimeslotsByActivityId/:activityId",
//   getBlockedTimeslotsByActivityId
// );
// router.post("/addBlockedTimeslot", vendorVerifyToken, addBlockedTimeslot);

// // Add 1 blockout timeslot to 1 or several activities
// router.post("/blockout/activities", vendorVerifyToken, addBlockedTimeslotMultipleActivities);
>>>>>>> develop-2

export default router;
