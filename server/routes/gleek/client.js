import express from "express";
import {
  postChangePassword,
  updateClientAccountDetails,
  updateConsentSettings,
  getConsentSettings,
  updateProfilePicture,
} from "../../controller/clientController.js";
import { verifyToken } from "../../middleware/clientAuth.js";
import { uploadS3ProfileImage } from "../../middleware/multer.js";

/*
Note: This file contains the /client router
*/

const router = express.Router();

router.post("/changePassword", verifyToken, postChangePassword);

router.patch("/updateAccount", verifyToken, updateClientAccountDetails);

router.patch("/consent", verifyToken, updateConsentSettings);

router.get("/consent", verifyToken, getConsentSettings);

router.patch(
  "/updateProfilePicture",
  verifyToken,
  uploadS3ProfileImage.single("image"),
  updateProfilePicture,
);

export default router;
