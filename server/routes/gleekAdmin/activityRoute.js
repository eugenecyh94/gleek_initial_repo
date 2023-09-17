import express from "express";
import {
  addActivity,
  bulkAddThemes,
  getActivity,
  getAllActivities,
} from "../../controller/activityController.js";

const router = express.Router();
router.post("/addActivity", addActivity);
router.get("/all", getAllActivities);
router.get("/viewActivity/:id", getActivity);
router.post("/addThemes", bulkAddThemes);
export default router;
