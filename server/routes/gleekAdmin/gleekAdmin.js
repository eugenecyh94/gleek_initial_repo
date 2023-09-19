import express from "express";
import { check } from "express-validator";
import {
  register,
  login,
  validateToken,
  clearCookies,
  getAdmin,
  getAllAdmin,
  changePassword,
  verifyEmail,
  recoverPassword,
  resetPassword,
} from "../../controller/adminController.js";
const router = express.Router();

// /gleek/register => POST

router.post(
  "/register",
  [
    // Validation middleware using check
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Minimum password length is 8").isLength({ min: 8 }),
  ],
  register,
);

router.post(
  "/login",
  [
    // Validation middleware using check
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Minimum password length is 8").isLength({ min: 8 }),
  ],
  login,
);

router.post("/validate-token", validateToken);

router.get("/logout", clearCookies);

router.get("/", getAllAdmin);

router.get("/:id", getAdmin);

router.post("/changePassword", changePassword);

router.get("/verify/:token", verifyEmail);

router.post("/recoverPassword", recoverPassword);

router.get("/resetPassword/:token", resetPassword);

export default router;
