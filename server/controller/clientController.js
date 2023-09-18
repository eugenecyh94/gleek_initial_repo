import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Client from "../model/clientModel.js";
import Consent from "../model/consentModel.js";
import jwt from "jsonwebtoken";
import {
  clientExists,
  createClient,
  encryptUserPassword,
} from "../service/clientService.js";
import {
  createClientConsent,
  updateConsent,
} from "../service/consentService.js";

const secret = process.env.JWT_SECRET_ClIENT;

/*
 * Generate JWT Token
 */
const generateJwtToken = async (clientId) => {
  const payload = {
    client: { id: clientId },
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
const setCookieAndRespond = (res, token, client) => {
  try {
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // Expires in 1 hour (milliseconds)
      sameSite: "None", // Adjust this based on your security requirements
      secure: true, // Use secure cookies in production
      path: "/", // Set the path to your application root
    });
    console.log(client);
    res.status(200).json({ token, client: client });
  } catch (cookieError) {
    console.error(cookieError);
    res.status(500).send("Error setting cookie");
  }
};

/**
 * Handles user registration by creating a new client and associated consent.
 * If an error occurs during the process, the transaction will be rolled back.
 */
export const postRegister = async (req, res) => {
  console.log("clientController postRegister(): req.body", req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { acceptTermsAndConditions, ...newClient } = req.body;
    console.log(
      "clientController postRegister(): acceptTermsAndConditions",
      acceptTermsAndConditions
    );

    if (await clientExists(newClient.email)) {
      return res.status(409).json({
        errors: [{ msg: "Client already exists! Please Login instead." }],
      });
    }

    const createdClient = await createClient(newClient, session);

    // Encrypt the user's password and save it to the database
    await encryptUserPassword(createdClient, newClient.password);

    // Create the Consent model and link to Client
    await createClientConsent(
      createdClient.id,
      acceptTermsAndConditions,
      session
    );

    const token = await generateJwtToken(createdClient.id);
    await session.commitTransaction();
    session.endSession();
    const { password, ...clientWithoutPassword } = createdClient.toObject();
    setCookieAndRespond(res, token, clientWithoutPassword);
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
    if (!client)
      return res
        .status(404)
        .send({ msg: "There is no account associated to this email!" });
    const isSamePassword = await bcrypt.compare(password, client.password);

    if (client && isSamePassword) {
      const token = await generateJwtToken(client.id);
      const { password, ...clientWithoutPassword } = client.toObject();

      setCookieAndRespond(res, token, clientWithoutPassword);
    } else {
      res.status(400).send({ msg: "Invalid Credentials" });
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

    const client = await Client.findById(decoded.client.id);

    if (!client) {
      return res.status(401).send("Client not found");
    }
    const { password, ...clientWithoutPassword } = client.toObject();
    res.status(200).json({ token, client: clientWithoutPassword });
  } catch (err) {
    // If verification fails (e.g., due to an invalid or expired token), send an error response
    return res.status(401).send("Invalid Token");
  }
};

export const clearCookies = async (req, res) => {
  res.clearCookie("token");
  res.status(200).end();
};

/*
 * Change password
 */
export const postChangePassword = async (req, res) => {
  const errors = validationResult(req);

  const client = req.user;
  // console.log(client);

  if (!errors.isEmpty()) {
    // 422 status due to validation errors
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const { oldPassword, newPassword } = req.body;

    const isSame = await bcrypt.compare(oldPassword, client.password);

    if (!isSame)
      return res.status(401).json("Old password entered is incorrect.");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    const updatedClient = await Client.findOneAndUpdate(
      { _id: client.id },
      { password: hashed },
      { new: true }
    );

    return res.status(200).json("Password successfully changed.");
  } catch (err) {
    console.error(err); // Log the error
    return res.status(500).send("Server Error");
  }
};

/*
 * Update the client account details (except for email and password)
 */
export const updateClientAccountDetails = async (req, res) => {
  try {
    const client = req.user;
    if (!client) {
      return res.status(404).send("Client not found. Token may have expired.");
    }

    const body = req.body;
    console.log("updateClientAccountDetails: body", body);

    // remove passwword and email in case it is sent along in the body
    const { password, email, ...updateData } = body;

    console.log("updateClientAccountDetails: UpdateData", updateData);
    const updatedClient = await Client.findOneAndUpdate(
      { _id: client.id },
      { ...updateData },
      {
        new: true,
        select: {
          password: 0,
        },
      }
    );

    console.log("updateClientAccountDetails: Updated client", updatedClient);

    res.status(200).json({
      success: true,
      message: "Your profile is successfully updated!",
      client: updatedClient,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
};

/*
 * Update the client settings (Receive marketing emails)
 *
 */
export const updateConsentSettings = async (req, res) => {
  try {
    const client = req.user;
    if (!client) {
      return res.status(404).send("Client not found. Token may have expired.");
    }

    const body = req.body;
    console.log("updatePrivacySettings: body", body);

    const updateData = body;

    const updatedConsent = await updateConsent(client, updateData);

    console.log("updatePrivacySettings: Updated consent", updatedConsent);

    res.status(200).json({
      msg: "Your privacy settings has been successfully updated!",
      consent: updatedConsent,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
};

/*
 * Get consent settings
 */
export const getConsentSettings = async (req, res) => {
  try {
    const client = req.user;
    if (!client) {
      return res.status(404).send("Client not found.");
    }
    const settings = await getClientConsent(client.id);

    res.status(200).json({
      msg: "Retrieved consent settings.",
      consent: settings,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
};
