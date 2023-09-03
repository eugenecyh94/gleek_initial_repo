import express from "express";
import { check } from "express-validator";
import { postRegister, postLogin } from "../../controller/clientController.js";
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

export default router;
