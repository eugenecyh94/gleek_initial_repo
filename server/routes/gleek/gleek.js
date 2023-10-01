import express from "express";
import shopRoutes from "./shop.js";
import authRoutes from "./auth.js";
import clientRoutes from "./client.js";
import vendorRoutes from "./vendor.js";
import bookmarkRoutes from "./bookmark.js";
import activityRoutes from "./activity.js";
import { userRouter } from "../../controller/gleekUserRouterController.js";
const router = express.Router();

/*
Note: This file contains the root router
*/

// /gleek/auth
router.use("/auth", authRoutes);
// /gleek/shop
router.use("/shop", shopRoutes);
// /gleek/client
router.use("/client", clientRoutes);
// /gleek/vendor
router.use("/vendor", vendorRoutes);
// /gleek/validate-token
router.post("/validateToken", userRouter);
// /gleek/bookmark
router.use("/bookmark", bookmarkRoutes);
// /gleek/activity
router.use("/activity", activityRoutes);
export default router;
