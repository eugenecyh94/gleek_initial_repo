import VendorModel from "../model/vendorModel.js";
import { VendorTypeEnum } from "../util/vendorTypeEnum.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {
  createVendor,
  vendorExists,
  encryptUserPassword,
} from "../service/vendorService.js";
import { validationResult } from "express-validator";
import { createVendorConsent } from "../service/consentService.js";
import bcrypt from "bcryptjs";
import { s3ImageGetService } from "../service/s3ImageGetService.js";
import {
  createVendorWelcomeMailOptions,
  createResendVerifyEmailOptionsVendor,
  createVerifyEmailOptionsVendor,
  createResetPasswordEmailOptionsVendor,
  createRegistrationApprovalEmailOptions,
} from "../util/sendMailOptions.js";
import sendMail from "../util/sendMail.js";

const secret = process.env.JWT_SECRET_VENDOR;

// sample account: companyEmail = "test@gmail.com", password = "7655Th#123"

/*
 * Generate JWT Token
 */
const generateJwtToken = async (vendorId) => {
  const payload = {
    vendor: { id: vendorId },
  };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

/*
 * Set JWT Token into res's cookie
 */
const setCookies = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3600000, // Expires in 1 hour (milliseconds)
    sameSite: "None", // Adjust this based on your security requirements
    secure: true, // Use secure cookies in production
    path: "/", // Set the path to your application root
  });
  res.cookie("userRole", "Vendor", {
    httpOnly: true,
    maxAge: 3600000,
    sameSite: "None",
    secure: true,
    path: "/",
  });
  return res;
};

/*
 * Set JWT Token into cookie and return HTTP 200
 */
const setCookieAndRespond = (res, token, vendor, msg) => {
  try {
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // Expires in 1 hour (milliseconds)
      sameSite: "None", // Adjust this based on your security requirements
      secure: true, // Use secure cookies in production
      path: "/", // Set the path to your application root
    });
    res.cookie("userRole", "Vendor", {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: "None",
      secure: true,
      path: "/",
    });
    if (msg) {
      res.status(200).json({ token, vendor: vendor, msg: msg });
    } else {
      res.status(200).json({ token, vendor: vendor });
    }
  } catch (cookieError) {
    console.error(cookieError);
    res.status(500).send({ msg: "Error setting cookie" });
  }
};

/**
 * Handles vendor registration by creating a new vendor and associated consent.
 * If an error occurs during the process, the transaction will be rolled back.
 */
export const postRegister = async (req, res) => {
  console.log("vendorController postRegister(): req.body", req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { acceptTermsAndConditions, ...newVendor } = req.body;
    console.log(
      "vendorController postRegister(): acceptTermsAndConditions",
      acceptTermsAndConditions,
    );

    if (await vendorExists(newVendor.companyEmail)) {
      return res.status(409).json({
        errors: [{ msg: "Vendor already exists! Please Login instead." }],
      });
    }

    const createdVendor = await createVendor(newVendor, session);

    // Encrypt the user's password and save it to the database
    await encryptUserPassword(createdVendor, newVendor.password);

    // Create the Consent model and link to Vendor
    await createVendorConsent(
      createdVendor.id,
      acceptTermsAndConditions,
      session,
    );

    const token = await generateJwtToken(createdVendor.id);
    await session.commitTransaction();
    sendMail(createVendorWelcomeMailOptions(createdVendor));
    sendMail(createVerifyEmailOptionsVendor(createdVendor, token));

    session.endSession();
    const { password, ...vendorWithoutPassword } = createdVendor.toObject();
    vendorWithoutPassword.companySocials = Object.fromEntries(
      vendorWithoutPassword.companySocials,
    );
    setCookieAndRespond(res, token, vendorWithoutPassword);
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send("Server Error");
  }
};

/*
 * Vendor clicks the link in their email to verify
 */
export const verifyEmail = async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res
      .status(403)
      .json({ status: "error", message: "Token Not Found!" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const requestorVendor = await VendorModel.findById(decoded.vendor.id);

    if (requestorVendor.verified) {
      return res.status(200).json({
        status: "already-verified",
        msg: "Your email has already been verified!",
      });
    }

    requestorVendor.verified = true;
    await requestorVendor.save();

    return res.status(200).json({
      status: "success",
      msg: "Vendor email has been verified. Welcome to Gleek!",
      vendor: requestorVendor,
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(200).json({
        status: "token-expired",
        msg: "Token has expired. Please request a new verification email.",
      });
    }

    console.error("Token verification error:", err);
    return res.status(500).json({ status: "error", msg: "Server Error" });
  }
};

/*
Vendor Login
*/
export const postLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // 422 status due to validation errors
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { companyEmail, password } = req.body;
    const vendor = await VendorModel.findOne({ companyEmail });
    const isSamePassword = await bcrypt.compare(password, vendor.password);

    if (vendor && isSamePassword) {
      // If vendor REJECTED, send error message.
      if (vendor.status === "REJECTED") {
        return res
          .status(400)
          .send({ msg: "Your Vendor registration has been rejected." });
      }
      if (vendor.companyLogo) {
        const preSignedUrl = await s3ImageGetService(vendor.companyLogo);
        vendor.preSignedPhoto = preSignedUrl;
      }
      // Convert the Map to a plain JavaScript object
      const token = await generateJwtToken(vendor.id);
      const { password, ...vendorWithoutPassword } = vendor.toObject();
      vendorWithoutPassword.companySocials = Object.fromEntries(
        vendorWithoutPassword.companySocials,
      );
      setCookieAndRespond(res, token, vendorWithoutPassword);
    } else {
      res.status(400).send({ status: "error", msg: "Invalid Credentials." });
    }
  } catch (err) {
    return res.status(500).send({ status: "error", msg: "Server Error" });
  }
};

/*
Token Validation for Vendor 
*/
export const validateToken = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, secret);

    const vendor = await VendorModel.findById(decoded.vendor.id);

    if (!vendor) {
      return res.status(401).send("Vendor not found");
    }

    if (vendor.companyLogo) {
      const preSignedUrl = await s3ImageGetService(vendor.companyLogo);
      vendor.preSignedPhoto = preSignedUrl;
    }

    const { password, ...vendorWithoutPassword } = vendor.toObject();
    vendorWithoutPassword.companySocials = Object.fromEntries(
      vendorWithoutPassword.companySocials,
    );
    return res.status(200).json({
      msg: "Vendor Validation Success",
      token,
      vendor: vendorWithoutPassword,
    });
  } catch (err) {
    // If verification fails (e.g., due to an invalid or expired token), send an error response
    return res.status(401).send({ status: "error", msg: "INvalid Token" });
  }
};
export const getAllVendorTypes = async (req, res) => {
  try {
    res
      .status(200)
      .json({ msg: "Retrieved Vendor Types", VendorTypeEnum: VendorTypeEnum });
  } catch (error) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};

/**
 Log out Venbdor by clearing cookies
 */
export const clearCookies = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("userRole");
  res.status(200).end();
};

/**
 Resend vendor verify email
 */
export const resendVerifyEmail = async (req, res) => {
  try {
    const vendor = req.user;

    const token = await generateJwtToken(vendor.id);

    sendMail(createResendVerifyEmailOptionsVendor(vendor, token));

    return res.status(200).json({
      msg: "Verification email resent.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "error", msg: "Server Error" });
  }
};

export const addVendor = async (req, res) => {
  try {
    const password = "adminpassword";
    const approvedDate = new Date();
    const status = "APPROVED";
    const newVendor = new VendorModel({
      ...req.body,
      password,
      approvedDate,
      status,
    });
    await newVendor.save();

    return res.status(201).json(newVendor);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create vendor" });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.find();
    return res.status(201).json(vendors);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};

export const getVendor = async (req, res) => {
  try {
    console.log(req.params.id);
    const vendor = await VendorModel.findById(req.params.id);
    return res.status(200).json(vendor);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};

export const deleteAllVendors = async (req, res) => {
  try {
    const deleteRes = await VendorModel.deleteMany({});
    return res.status(200).json(deleteRes);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};

export const updateVendor = async (req, res) => {
  try {
    const updateData = req.body;
    const updatedVendor = await VendorModel.findOneAndUpdate(
      { _id: req.params.id },
      { ...updateData, approvedDate: new Date() },
      { new: true },
    );
    sendMail(createRegistrationApprovalEmailOptions(updatedVendor));
    return res.status(201).json(updatedVendor);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};

/*
Update company logo
*/
export const updateCompanyLogo = async (req, res) => {
  try {
    const vendor = req.user;
    const reqFile = req.file;

    let fileS3Location;
    console.log(reqFile);
    if (reqFile === undefined) {
      console.log("No image files uploaded");
    } else {
      console.log("Retrieving uploaded images url");
      fileS3Location = req.file.location;
    }

    const updatedVendor = await VendorModel.findOneAndUpdate(
      { _id: vendor._id },
      { companyLogo: fileS3Location },
      { new: true },
    );

    if (updatedVendor.companyLogo) {
      const preSignedUrl = await s3ImageGetService(updatedVendor.companyLogo);
      updatedVendor.preSignedPhoto = preSignedUrl;
    }

    return res.status(200).json({
      success: true,
      message: "Your company logo is successfully updated!",
      vendor: updatedVendor,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: true,
      msg: "Server error",
    });
  }
};

/*
 * Change password for Vendor
 */
export const postChangePassword = async (req, res) => {
  const errors = validationResult(req);

  const vendor = req.user;

  if (!errors.isEmpty()) {
    // 422 status due to validation errors
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { oldPassword, newPassword } = req.body;

    const isSame = await bcrypt.compare(oldPassword, vendor.password);

    if (!isSame)
      return res.status(401).json("Old password entered is incorrect.");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    const updatedVendor = await VendorModel.findOneAndUpdate(
      { _id: vendor.id },
      { password: hashed },
      { new: true },
    );

    return res.status(200).json("Password successfully changed.");
  } catch (err) {
    console.error(err); // Log the error
    return res.status(500).send("Server Error");
  }
};

/*
 * Update the vendor account details (except for email and password)
 */
export const updateVendorAccountDetails = async (req, res) => {
  try {
    const vendor = req.user;

    const body = req.body;
    console.log("updateVendorAccountDetails: body", body);

    // remove password and email in case it is sent along in the body
    const { password, companyEmail, ...updateData } = body;

    console.log("updateVendorAccountDetails: UpdateData", updateData);
    const updatedVendor = await VendorModel.findOneAndUpdate(
      { _id: vendor.id },
      { ...updateData },
      {
        new: true,
        select: {
          password: 0,
        },
      },
    );

    console.log("updateVendorAccountDetails: Updated vendor", updatedVendor);

    res.status(200).json({
      success: true,
      msg: "Your profile is successfully updated!",
      vendor: updatedVendor,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json(
      res.status(500).json({
        error: true,
        msg: "Server error",
      }),
    );
  }
};

/*
 * Reset password (after getting recovering password email)
 */
export const postResetPassword = async (req, res) => {
  const vendor = req.user;

  try {
    const { newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    const updatedVendor = await VendorModel.findOneAndUpdate(
      { _id: vendor.id },
      { password: hashed },
      { new: true },
    );

    return res.status(200).json({ msg: "Password successfully changed." });
  } catch (err) {
    console.error(err); // Log the error
    return res.status(500).send({
      error: true,
      msg: "Server error",
    });
  }
};

/*
 * Send recover password email
 */
export const recoverPasswordMail = async (req, res) => {
  try {
    const { companyEmail } = req.body;
    const vendor = await VendorModel.findOne({ companyEmail }).select(
      "-password",
    );
    if (!vendor) {
      return res
        .status(400)
        .json({ msg: "There is no account tied to this email." });
    }

    const token = await generateJwtToken(vendor.id);
    sendMail(createResetPasswordEmailOptionsVendor(vendor, token));

    return setCookieAndRespond(res, token, vendor, "Recovery email sent!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error " + err.message);
  }
};

/*
 * Redirect vendor to reset password page
 */
export const resetPasswordRedirect = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(403).send("Token Not Found!");
  }
  console.log("RESET");
  console.log(token);
  try {
    setCookies(res, token);
    res.status(200).redirect("http://localhost:3001/vendor/resetPassword");
  } catch (cookieError) {
    console.log(cookieError);
    return res.status(500).send("Error setting cookie");
  }
};
