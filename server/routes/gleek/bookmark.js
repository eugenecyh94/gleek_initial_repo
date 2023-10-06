import express from "express";
import {
  updateBookmark,
  fetchBookmarks,
  getActivityBookmark,
  getActivityBookmarkStatus,
  updateActivityBookmark,
  updateVendorBookmark,
  getVendorBookmark,
} from "../../controller/bookmarkController.js";
import { verifyToken } from "../../middleware/clientAuth.js";
const router = express.Router();

router.get("/", verifyToken, fetchBookmarks);
router.post("/", verifyToken, updateBookmark);


router.post("/activity/:activityId", verifyToken, updateActivityBookmark);
router.get("/activity/:activityId", verifyToken, getActivityBookmark);
router.get("/activity/:activityId/status", verifyToken, getActivityBookmarkStatus);

router.post("/vendor/:vendorId", verifyToken, updateVendorBookmark);
router.get("/vendor/:vendorId", verifyToken, getVendorBookmark);

export default router;
