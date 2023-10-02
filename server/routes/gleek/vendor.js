import express from "express";
import { check } from "express-validator";
import {
  getAllVendorTypes,
  getVendor,
  updateCompanyLogo,
} from "../../controller/vendorController.js";
import { postRegister } from "../../controller/vendorController.js";
import { validateToken } from "../../controller/vendorController.js";
import { postLogin } from "../../controller/vendorController.js";
import { clearCookies } from "../../controller/vendorController.js";
import verifyToken from "../../middleware/vendorAuth.js";
import { uploadS3CompanyLogo } from "../../middleware/multer.js";
import { postChangePassword } from "../../controller/vendorController.js";
import { updateVendorAccountDetails } from "../../controller/vendorController.js";
import { verifyEmail } from "../../controller/vendorController.js";
import { resendVerifyEmail } from "../../controller/vendorController.js";
import { recoverPasswordMail } from "../../controller/vendorController.js";
import { postResetPassword } from "../../controller/vendorController.js";
import { resetPasswordRedirect } from "../../controller/vendorController.js";
const router = express.Router();

/*
Note: This file contains the /vendor router
*/

// /gleek/vendor/viewVendor/:id
router.get("/viewVendor/:id", getVendor);
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
router.patch(
  "/updateCompanyLogo",
  verifyToken,
  uploadS3CompanyLogo.single("image"),
  updateCompanyLogo,
);
// Verify Email
router.get("/verifyEmail/:token", verifyEmail);
// Verify Email Resend
router.get("/resendVerifyEmail", verifyToken, resendVerifyEmail);
router.post("/changePassword", verifyToken, postChangePassword);
router.patch("/updateAccount", verifyToken, updateVendorAccountDetails);
router.post("/recoverPasswordMail", recoverPasswordMail);
router.post("/resetPassword", verifyToken, postResetPassword);
router.get("/resetPassword/:token", resetPasswordRedirect);

export default router;
