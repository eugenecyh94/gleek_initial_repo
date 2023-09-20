import express from "express";
import { check } from "express-validator";
import { getAllVendorTypes } from "../../controller/vendorController.js";
import { postRegister } from "../../controller/vendorController.js";

const router = express.Router();

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
export default router;
