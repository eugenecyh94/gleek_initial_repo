import express from "express";

import vendorVerifyToken from "../../middleware/vendorAuth.js";
import {
  getActivityTitle,
  getVendorActivities,
} from "../../controller/activityController.js";

const router = express.Router();

/**
 * GET /gleekVendor/activity/mine
 * Get Activities belonging to the Vendor that made the request
 */
router.get("/mine", vendorVerifyToken, getVendorActivities);

router.get("/:activityId/title", vendorVerifyToken, getActivityTitle);

export default router;
