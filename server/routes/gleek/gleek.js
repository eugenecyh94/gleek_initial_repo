import express from "express";
import shopRoutes from "./shop.js";
import authRoutes from "./auth.js";
import clientRoutes from "./client.js";
import vendorRoutes from "./vendor.js";
const router = express.Router();

// /gleek/auth
router.use("/auth", authRoutes);
// /gleek/shop
router.use("/shop", shopRoutes);
// /gleek/client
router.use("/client", clientRoutes);
router.use("/vendor", vendorRoutes);
export default router;
