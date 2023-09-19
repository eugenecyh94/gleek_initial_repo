import express from "express";
import {
  postChangePassword,
  updateClientAccountDetails,
  updateConsentSettings,
  getConsentSettings
} from "../../controller/clientController.js";

import verifyToken from "../../middleware/clientAuth.js";
const router = express.Router();

router.post("/changePassword", verifyToken, postChangePassword);

router.patch("/updateAccount", verifyToken, updateClientAccountDetails);

router.patch("/consent", verifyToken, updateConsentSettings);
router.get("/consent", verifyToken, getConsentSettings);

export default router;
