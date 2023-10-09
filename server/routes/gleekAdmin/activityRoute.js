import express from "express";
import {
  addActivity,
  approveActivity,
  bulkAddThemes,
  bulkDeleteActivityDraft,
  deleteActivityDraft,
  getActivity,
  getAllActivities,
  getAllActivitiesForAdmin,
  getAllThemes,
  rejectActivity,
  saveActivity,
} from "../../controller/activityController.js";
import { uploadS3ActivityImages } from "../../middleware/multer.js";

const router = express.Router();
router.post(
  "/addActivity",
  uploadS3ActivityImages.array("images", 5),
  addActivity,
);
router.post(
  "/saveActivity",
  uploadS3ActivityImages.array("images", 5),
  saveActivity,
);
router.get("/all", getAllActivities);
router.get("/myActivities/:id", getAllActivitiesForAdmin);
router.get("/viewActivity/:id", getActivity);
router.post("/addThemes", bulkAddThemes);
router.get("/getThemes", getAllThemes);
router.delete("/deleteDraft/:id", deleteActivityDraft);
router.delete("/bulkDelete", bulkDeleteActivityDraft);
router.patch("/approveActivity/:activityId", approveActivity);
router.patch("/rejectActivity/:activityId", rejectActivity);
export default router;
