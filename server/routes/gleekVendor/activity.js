import express from "express";

import vendorVerifyToken from "../../middleware/vendorAuth.js";
import {
  bulkDeleteActivityDraft,
  deleteActivityDraft,
  getActivity,
  getAllThemes,
  getPreSignedImgs,
  getVendorActivities,
  publishActivity,
  saveActivity,
} from "../../controller/activityController.js";
import { uploadS3ActivityImages } from "../../middleware/multer.js";

const router = express.Router();

/**
 * GET /gleekVendor/activity/mine
 * Get Activities belonging to the Vendor that made the request
 */
router.get("/mine", vendorVerifyToken, getVendorActivities);
router.delete("/deleteDraft/:id", vendorVerifyToken, deleteActivityDraft);
router.delete("/bulkDelete", vendorVerifyToken, bulkDeleteActivityDraft);
router.get("/getThemes", vendorVerifyToken, getAllThemes);
router.post(
  "/saveActivity",
  vendorVerifyToken,
  uploadS3ActivityImages.array("images", 5),
  saveActivity
);
router.get("/viewActivity/:id", vendorVerifyToken, getActivity);
router.patch("/publishActivity/:id", vendorVerifyToken, publishActivity);
router.get("/getImages/:id", vendorVerifyToken, getPreSignedImgs);

export default router;
