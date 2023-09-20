import VendorModel from "../model/vendorModel.js";
import { VendorTypeEnum } from "../util/vendorTypeEnum.js";
import mongoose from "mongoose";
const secret = process.env.JWT_SECRET_VENDOR;
import jwt from "jsonwebtoken";
import {
  createVendor,
  vendorExists,
  encryptUserPassword,
} from "../service/vendorService.js";
import { validationResult } from "express-validator";
import { createVendorConsent } from "../service/consentService.js";

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
    res.status(200).json({ token, vendor: vendor });
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
    const { email, password } = req.body;
    const client = await Client.findOne({ email });

    if (client && (await bcrypt.compare(password, client.password))) {
      const payload = {
        client: {
          id: client.id,
          email: client.email,
        },
      };
      jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        // Set the JWT token as a cookie
        try {
          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000, // Expires in 1 hour (milliseconds)
            sameSite: "None", // Adjust this based on your security requirements
            secure: true, // Use secure cookies in production
            path: "/", // Set the path to your application root
          });
          res.cookie("userRole", "Client", {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: "None",
            secure: true,
            path: "/",
          });
        } catch (cookieError) {
          console.error(cookieError);
          return res.status(500).send("Error setting cookie");
        }
        const { password, ...vendorWithoutPassword } = vendor.toObject();

        res.status(200).json({ token, vendor: vendorWithoutPassword });
      });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    return res.status(500).send("Server Error");
  }
};

export const getAllVendorTypes = async (req, res) => {
  try {
    res.status(200).json(VendorTypeEnum);
  } catch (error) {
    console.log(e);
    res.status(500).json("Server Error");
  }
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
