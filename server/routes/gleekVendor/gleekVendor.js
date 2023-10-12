import express from "express";
import timeslotRoutes from "./timeslot.js";
import activityRoutes from "./activity.js";

const router = express.Router();

// /gleekVendor/auth
// TODO: Migrate all /gleek/vendor auth routes to here
// router.use("/auth", authRoutes);

// /gleekVendor/timeslot
router.use("/timeslot", timeslotRoutes);

// /gleekVendor/activity
router.use("/activity", activityRoutes);
export default router;
