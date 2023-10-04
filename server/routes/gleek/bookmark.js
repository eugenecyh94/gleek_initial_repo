import express from "express";
import {
  updateBookmark,
  fetchBookmarks,
  getActivityBookmark,
  getActivityBookmarkStatus,
  updateActivityBookmark,
} from "../../controller/bookmarkController.js";
import { verifyToken } from "../../middleware/clientAuth.js";
const router = express.Router();

router.get("/", verifyToken, fetchBookmarks);
router.post("/", verifyToken, updateBookmark);


router.post("/activity/:activityId", verifyToken, updateActivityBookmark);
router.get("/activity/:activityId", verifyToken, getActivityBookmark);
router.get("/activity/:activityId/status", verifyToken, getActivityBookmarkStatus);
export default router;
