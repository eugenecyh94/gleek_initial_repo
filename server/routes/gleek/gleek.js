import express from "express";
import shopRoutes from "./shop.js";
import authRoutes from "./auth.js";
const router = express.Router();

// /gleek/auth
router.use("/auth", authRoutes);
// /gleek/shop
router.use("/shop", shopRoutes);

export default router;
