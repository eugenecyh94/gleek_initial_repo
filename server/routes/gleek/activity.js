import { getActivitiesByVendorId } from "../../controller/activityController.js";
import express from "express";
const router = express.Router();

// /gleek/activity/vendor/vendorId
router.get("/vendor/:vendorId", getActivitiesByVendorId);

export default router;
