import express from "express";
import {
  addActivity,
  bulkAddThemes,
  getActivity,
  getAllActivities,
  getAllThemes,
} from "../../controller/activityController.js";
import { uploadS3ActivityImages } from "../../middleware/multer.js";

const router = express.Router();
router.post(
  "/addActivity",
  uploadS3ActivityImages.array("images", 5),
  addActivity,
);
router.get("/all", getAllActivities);
router.get("/viewActivity/:id", getActivity);
router.post("/addThemes", bulkAddThemes);
router.get("/getThemes", getAllThemes);
export default router;
