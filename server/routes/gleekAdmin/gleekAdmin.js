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
   resendVerifyEmail,
} from "../../controller/adminController.js";

import adminAuth from "../../middleware/adminAuth.js";
const router = express.Router();

// /gleek/register => POST

router.post(
   "/register",
   [
      // Validation middleware using check
      check("email", "Please enter a valid email").isEmail(),
   ],
   register
);

router.post(
   "/login",
   [
      // Validation middleware using check
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Minimum password length is 8").isLength({ min: 8 }),
   ],
   login
);

router.post("/validate-token", validateToken);

router.get("/logout", adminAuth, clearCookies);

router.get("/", adminAuth, getAllAdmin);

router.get("/:id", adminAuth, getAdmin);

router.post("/changePassword", adminAuth, changePassword);

router.get("/verify/:token", verifyEmail);

router.post("/recoverPassword", recoverPassword);

router.get("/resetPassword/:token", resetPassword);

router.post("/resendVerificationEmail", resendVerifyEmail);

export default router;
