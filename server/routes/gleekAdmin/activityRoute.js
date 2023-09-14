import express from "express";
import auth from "../../middleware/adminAuth.js";
import {
  addActivity,
  getActivity,
  getAllActivities,
} from "../../controller/activityController.js";

const router = express.Router();
router.post("/addActivity", addActivity);
router.get("/all", auth, getAllActivities);
router.get("/viewActivity/:id", getActivity);
export default router;
