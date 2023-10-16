import express from "express";
import {
  getAdminNotifications,
  getNonAdminNotifications,
  updateNotificationAsRead,
  updateAllNotificationsAsRead,
  deleteNotification,
} from "../controller/notificationController.js";
import { verifyToken } from "./../middleware/clientAuth.js";

/*
Note: This file contains the /client router
*/

const router = express.Router();

router.get("/adminAllNotifications", getAdminNotifications);

router.get("/nonAdminAllNotifications", verifyToken, getNonAdminNotifications);

router.patch("/updateNotificationAsRead", updateNotificationAsRead);

router.patch("/updateAllNotificationsAsRead", updateAllNotificationsAsRead);

router.patch("/deleteNotification", deleteNotification);

export default router;
