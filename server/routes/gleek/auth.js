import express from "express";
import { check } from "express-validator";
import {
  clearCookies,
  postLogin,
  postRegister,
  recoverPasswordMail,
  resetPasswordRedirect,
  validateToken,
} from "../../controller/clientController.js";
const router = express.Router();

/*
Note: This file contains the /auth router
*/

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

router.post("/validateToken", validateToken);

router.get("/logout", clearCookies);

router.post("/recoverPassword", recoverPasswordMail);
router.get("/resetPassword/:token", resetPasswordRedirect);

export default router;
