import express from "express";
import {
  getActivitiesByVendorId,
  getVendorActivities,
} from "../../controller/activityController.js";
import vendorVerifyToken from "../../middleware/vendorAuth.js";
const router = express.Router();

// /gleek/activity/vendor/vendorId
router.get("/vendor/:vendorId", getActivitiesByVendorId);


export default router;
