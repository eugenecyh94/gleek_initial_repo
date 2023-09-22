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
import sendMail from "../util/sendMail.js";
import { s3ImageGetService } from "../service/s3ImageGetService.js";
import {
  createClientWelcomeMailOptions,
  createResendVerifyEmailOptions,
  createResetPasswordEmailOptions,
  createVerifyEmailOptions,
} from "../util/sendMailOptions.js";

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
const setCookieAndRespond = (res, token, client, msg) => {
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
    console.log(client);
    if (msg) {
      res.status(200).json({ token, client: client, msg: msg });
    } else {
      res.status(200).json({ token, client: client });
    }
  } catch (cookieError) {
    console.error(cookieError);
    res.status(500).send("Error setting cookie");
  }
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
  res.cookie("userRole", "Client", {
    httpOnly: true,
    maxAge: 3600000,
    sameSite: "None",
    secure: true,
    path: "/",
  });
  return res;
};

/**
 * Handles user registration by creating a new client and associated consent.
 * If an error occurs during the process, the transaction will be rolled back.
 * Sends welcome to Gleek email.
 * Sends verify email email.
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

    if (await clientExists(newClient.email)) {
      return res.status(409).json({
        errors: [{ msg: "Email already exists!" }],
      });
    }

    const createdClient = await createClient(newClient, session);

    await encryptUserPassword(createdClient, newClient.password);

    // Create the Consent model and link to Client
    await createClientConsent(
      createdClient.id,
      acceptTermsAndConditions,
      session,
      session,
    );

    const token = await generateJwtToken(createdClient.id);

    await session.commitTransaction();

    sendMail(createClientWelcomeMailOptions(createdClient));
    sendMail(createVerifyEmailOptions(createdClient, token));
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
    if (!client) return res.status(404).send({ msg: "Invalid Credentials." });

    const isSamePassword = await bcrypt.compare(password, client.password);

    if (client && isSamePassword) {
      // If client REJECTED, send error message.
      if (client.status === "REJECTED") {
        return res
          .status(400)
          .send({ msg: "Your Client registration has been rejected." });
      }

      if (client.photo) {
        const preSignedUrl = await s3ImageGetService(client.photo);
        client.preSignedPhoto = preSignedUrl;
      }

      const token = await generateJwtToken(client.id);
      const { password, ...clientWithoutPassword } = client.toObject();

      setCookieAndRespond(res, token, clientWithoutPassword);
    } else {
      return res.status(400).send({ msg: "Invalid Credentials." });
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

    if (client.photo) {
      const preSignedUrl = await s3ImageGetService(client.photo);
      client.preSignedPhoto = preSignedUrl;
    }

    const { password, ...clientWithoutPassword } = client.toObject();

    return res.status(200).json({ token, client: clientWithoutPassword });
  } catch (err) {
    console.error(err);
    // If verification fails (e.g., due to an invalid or expired token), send an error response
    return res.status(401).send("Invalid Token");
  }
};

export const clearCookies = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("userRole");
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
      return res
        .status(401)
        .json({ msg: "Old password entered is incorrect." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    const updatedClient = await Client.findOneAndUpdate(
      { _id: client.id },
      { password: hashed },
      { new: true },
    );

    return res.status(200).json({ msg: "Password successfully changed." });
  } catch (err) {
    console.error(err); // Log the error
    return res.status(500).send({ msg: "Server Error" });
  }
};

/*
 * Reset password (after getting recovering password email)
 */
export const postResetPassword = async (req, res) => {
  const client = req.user;

  try {
    const { newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    const updatedClient = await Client.findOneAndUpdate(
      { _id: client.id },
      { password: hashed },
      { new: true },
    );

    return res.status(200).json({ msg: "Password successfully changed." });
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

    // remove password and email in case it is sent along in the body
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
      },
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

export const updateProfilePicture = async (req, res) => {
  try {
    const client = req.user;
    const reqFile = req.file;
    console.log("req client", client);
    console.log("req file", reqFile);

    let fileS3Location;

    if (reqFile === undefined) {
      console.log("No image files uploaded");
    } else {
      console.log("Retrieving uploaded images url");
      fileS3Location = req.file.location;
    }

    console.log(fileS3Location);
    console.log("client id", client._id);

    const updatedClient = await Client.findOneAndUpdate(
      { _id: client._id },
      { photo: fileS3Location },
      { new: true },
    );

    if (updatedClient.photo) {
      const preSignedUrl = await s3ImageGetService(updatedClient.photo);
      updatedClient.preSignedPhoto = preSignedUrl;
    }

    console.log(updatedClient);

    return res.status(200).json({
      success: true,
      message: "Your profile picture is successfully updated!",
      client: updatedClient,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json("Server Error");
  }
};

/*
 * Client clicks the link in their email to verify
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
    const requestorClient = await Client.findById(decoded.client.id);

    if (requestorClient.verified) {
      return res.status(200).json({
        status: "already-verified",
        msg: "Your email has already been verified!",
      });
    }

    requestorClient.verified = true;
    await requestorClient.save();

    return res.status(200).json({
      status: "success",
      msg: "Client email has been verified. Welcome to Gleek!",
      client: requestorClient,
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

export const resendVerifyEmail = async (req, res) => {
  try {
    const client = req.user;

    const token = await generateJwtToken(client.id);

    sendMail(createResendVerifyEmailOptions(client, token));

    return res.status(200).json({
      msg: "Verification email resent.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "error", msg: "Server Error" });
  }
};

export const recoverPasswordMail = async (req, res) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email }).select("-password");
    if (!client) {
      return res
        .status(400)
        .json({ msg: "There is no account tied to this email." });
    }

    const token = await generateJwtToken(client.id);
    sendMail(createResetPasswordEmailOptions(client, token));

    return setCookieAndRespond(res, token, client, "Recovery email sent!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error " + err.message);
  }
};

export const resetPasswordRedirect = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(403).send("Token Not Found!");
  }

  try {
    setCookies(res, token);
    res.status(200).redirect("http://localhost:3001/client/resetPassword");
  } catch (cookieError) {
    return res.status(500).send("Error setting cookie");
  }
};
