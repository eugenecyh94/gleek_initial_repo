import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import Client from "../model/clientModel.js";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET_ClIENT;

export const postRegister = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // 422 status due to validation errors
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const newClient = req.body;

    // check if client already exists
    // Validate if client exists in our database
    const oldClient = await Client.findOne({ email: newClient.email });

    if (oldClient) {
      return res.status(409).json({
        errors: [{ msg: "Client already exists! Please Login instead." }],
      });
    }

    // Create user in our database
    const client = await Client.create({
      email: newClient.email.toLowerCase(), // sanitize: convert email to lowercase
      ...newClient,
    });

    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    client.password = await bcrypt.hash(newClient.password, salt);

    await client.save(); // saves to the database

    const payload = {
      client: {
        id: client.id,
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
      } catch (cookieError) {
        console.error(cookieError);
        return res.status(500).send("Error setting cookie");
      }
      res.status(200).json({ token, client: { email: client.email } });
    });
  } catch (err) {
    console.error(err); // Log the error
    return res.status(500).send("Server Error");
  }
  // Our register logic ends here
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
        } catch (cookieError) {
          console.error(cookieError);
          return res.status(500).send("Error setting cookie");
        }
        const { password, ...clientWithoutPassword } = client.toObject();

        // console.log(clientWithoutPassword)
        res.status(200).json({ token, client: clientWithoutPassword });
      });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    return res.status(500).send("Server Error");
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
