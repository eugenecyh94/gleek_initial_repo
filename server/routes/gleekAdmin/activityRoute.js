import express from "express";
import {
  addActivity,
  bulkAddThemes,
  deleteActivityDraft,
  getActivity,
  getAllActivities,
  getAllActivitiesForAdmin,
  getAllThemes,
  saveActivity,
} from "../../controller/activityController.js";
import { uploadS3ActivityImages } from "../../middleware/multer.js";

const router = express.Router();
router.post(
  "/addActivity",
  uploadS3ActivityImages.array("images", 5),
  addActivity
);
router.post(
  "/saveActivity",
  uploadS3ActivityImages.array("images", 5),
  saveActivity
);
router.get("/all", getAllActivities);
router.get("/myActivities/:id", getAllActivitiesForAdmin);
router.get("/viewActivity/:id", getActivity);
router.post("/addThemes", bulkAddThemes);
router.get("/getThemes", getAllThemes);
router.delete("/deleteDraft/:id", deleteActivityDraft);
export default router;
