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
 * Set JWT Token into cookie and return HTTP 200
 */
const setCookieAndRespond = (res, token, vendor) => {
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
    console.log(vendor);
    res
      .status(200)
      .json({ msg: "Retrieved Vendor Account", token, vendor: vendor });
  } catch (cookieError) {
    console.error(cookieError);
    res.status(500).send("Error setting cookie");
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
    session.endSession();
    const { password, ...vendorWithoutPassword } = createdVendor.toObject();
    setCookieAndRespond(res, token, vendorWithoutPassword);
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send("Server Error");
  }
};

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
      const token = await generateJwtToken(vendor.id);
      const { password, ...vendorWithoutPassword } = vendor.toObject();
      setCookieAndRespond(res, token, vendorWithoutPassword);
    } else {
      res.status(400).send({ msg: "Invalid Credentials." });
    }
  } catch (err) {
    return res.status(500).send({ msg: "Server Error" });
  }
};

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
    return res.status(200).json({
      msg: "Vendor Validation Success",
      token,
      vendor: vendorWithoutPassword,
    });
  } catch (err) {
    // If verification fails (e.g., due to an invalid or expired token), send an error response
    return res.status(401).send("Invalid Token");
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

export const clearCookies = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("userRole");
  res.status(200).end();
};

export const addVendor = async (req, res) => {
  try {
    const newVendor = new VendorModel({ ...req.body });
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
    return res.status(201).json(vendor);
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
      { ...updateData },
      { new: true },
    );
    return res.status(201).json(updatedVendor);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};

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
    res.status(500).json("Server Error");
  }
};
