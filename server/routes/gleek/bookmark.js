import express from "express";
import {
  updateBookmark,
  fetchBookmarks,
} from "../../controller/bookmarkController.js";
import { verifyToken } from "../../middleware/clientAuth.js";
const router = express.Router();

router.get("/", verifyToken, fetchBookmarks);
router.post("/", verifyToken, updateBookmark);
export default router;
