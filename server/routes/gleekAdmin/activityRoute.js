import express from "express";
import {
  approveActivity,
  bulkAddThemes,
  bulkDeleteActivityDraft,
  deleteActivityDraft,
  getActivity,
  getAllActivities,
  getAllActivitiesForAdmin,
  getAllThemes,
  getPreSignedImgs,
  rejectActivity,
  saveActivity,
} from "../../controller/activityController.js";
import { uploadS3ActivityImages } from "../../middleware/multer.js";
import adminAuth from "../../middleware/adminAuth.js";

const router = express.Router();
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
router.get("/getImages/:id", getPreSignedImgs);

export default router;
