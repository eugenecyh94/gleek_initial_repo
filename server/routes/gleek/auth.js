import express from "express";
import { check } from "express-validator";
import {
  postRegister,
  postLogin,
  validateToken,
  clearCookies,
} from "../../controller/clientController.js";
import shopRoutes from "./shop.js";
const router = express.Router();

// /gleek/register => POST

router.post(
  "/register",
  [
    // Validation middleware using check
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Minimum password length is 8").isLength({ min: 8 }),
  ],
  postRegister,
);

router.post(
  "/login",
  [
    // Validation middleware using check
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Minimum password length is 8").isLength({ min: 8 }),
  ],
  postLogin,
);

router.post("/validate-token", validateToken);

router.get("/logout", clearCookies);

export default router;
