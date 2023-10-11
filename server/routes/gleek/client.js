import express from "express";
import {
  getConsentSettings,
  postChangePassword,
  postResetPassword,
  resendVerifyEmail,
  updateClientAccountDetails,
  updateConsentSettings,
  updateProfilePicture,
  verifyEmail,
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

// Verify Email
router.get("/verifyEmail/:token", verifyEmail);
// Verify Email Resend
router.get("/resendVerifyEmail", verifyToken, resendVerifyEmail);
router.post("/resetPassword", verifyToken, postResetPassword);

export default router;
