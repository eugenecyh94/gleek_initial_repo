import express from "express";
import { check } from "express-validator";
import { getAllVendorTypes } from "../../controller/vendorController.js";
import { postRegister } from "../../controller/vendorController.js";
import { validateToken } from "../../controller/vendorController.js";
import { postLogin } from "../../controller/vendorController.js";
import { clearCookies } from "../../controller/vendorController.js";
const router = express.Router();

/*
Note: This file contains the /vendor router
*/

// /gleek/vendor/getAllVendorTypes
router.get("/getAllVendorTypes", getAllVendorTypes);
router.post(
  "/register",
  [
    // Validation middleware using check
    check("companyEmail", "Please enter a valid email").isEmail(),
    check("password", "Minimum password length is 8").isLength({ min: 8 }),
  ],
  postRegister,
);
router.post(
  "/login",
  [
    // Validation middleware using check
    check("companyEmail", "Please enter a valid email").isEmail(),
    check("password", "Minimum password length is 8").isLength({ min: 8 }),
  ],
  postLogin,
);
router.post("/validateToken", validateToken);
router.get("/logout", clearCookies);
export default router;
