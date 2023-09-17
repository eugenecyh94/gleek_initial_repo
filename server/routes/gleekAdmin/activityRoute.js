import express from "express";
import {
  addActivity,
  getActivity,
  getAllActivities,
} from "../../controller/activityController.js";

const router = express.Router();
router.post("/addActivity", addActivity);
router.get("/all", getAllActivities);
router.get("/viewActivity/:id", getActivity);
export default router;
