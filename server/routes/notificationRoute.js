import express from "express";
import {
  getAdminNotifications,
  getNonAdminNotifications,
} from "../controller/notificationController.js";
import { verifyToken } from "./../middleware/clientAuth.js";

/*
Note: This file contains the /client router
*/

const router = express.Router();

router.get("/adminAllNotifications", getAdminNotifications);

router.get("/nonAdminAllNotifications", verifyToken, getNonAdminNotifications);

export default router;
