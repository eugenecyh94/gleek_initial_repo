import express from "express";
import {
   addActivity,
   bulkAddThemes,
   bulkDeleteActivityDraft,
   deleteActivityDraft,
   getActivity,
   getAllActivities,
   getAllActivitiesForAdmin,
   getAllThemes,
   saveActivity,
} from "../../controller/activityController.js";
import { uploadS3ActivityImages } from "../../middleware/multer.js";
import adminAuth from "../../middleware/adminAuth.js";

const router = express.Router();
router.post(
   "/addActivity",
   uploadS3ActivityImages.array("images", 5),
   adminAuth,
   addActivity
);
router.post(
   "/saveActivity",
   uploadS3ActivityImages.array("images", 5),
   adminAuth,
   saveActivity
);
router.get("/all", adminAuth, getAllActivities);
router.get("/myActivities/:id", adminAuth, getAllActivitiesForAdmin);
router.get("/viewActivity/:id", adminAuth, getActivity);
router.post("/addThemes", adminAuth, bulkAddThemes);
router.get("/getThemes", adminAuth, getAllThemes);
router.delete("/deleteDraft/:id", adminAuth, deleteActivityDraft);
router.delete("/bulkDelete", adminAuth, bulkDeleteActivityDraft);
export default router;
