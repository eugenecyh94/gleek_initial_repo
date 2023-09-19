import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import Admin from "../model/adminModel.js";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

//@route GET api/admin
//@access Public
//@desc Test Route
export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json(admin);
  } catch (err) {
    return res.status(401).json();
  }
};

//@route GET api/admin
//@access Public
//@desc Test Route
export const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();

    if (!admins) {
      return res.status(404).send("No admins found!");
    }

    res.json(admins);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

//@route GET api/admins
//@access Public
//@desc Register Admin
export const register = async (req, res) => {
  //the slash is the default route when the api endpoint hits the resource
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, role } = req.body;
    let admin = await Admin.findOne({ email }); //returns a promise

    if (admin) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Admin already exists!" }] });
    }

    admin = new Admin({
      //creates a new admin instance but not saved in db until the admin.save() is called
      name,
      email,
      password,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save(); //saves to the database

    const payload = {
      admin: {
        id: admin.id,
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
      res.status(200).json({ token, admin: { email: admin.email } });
    });
  } catch (err) {
    return res.status(500).send("Server Error");
  }
};

export const clearCookies = async (req, res) => {
  res.clearCookie("token");
  res.status(200).end();
};

//@route POST api/auth
//@access Public
//@desc Login Admin
export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      admin: {
        id: admin.id,
      },
    };

    jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      try {
        res
          .cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000, // Expires in 1 hour (milliseconds)
            sameSite: "None", // Adjust this based on your security requirements
            secure: true, // Use secure cookies in production
            path: "/", // Set the path to your application root
          })
          .status(200)
          .json({ token, admin: { email: admin.email } });
      } catch (cookieError) {
        return res.status(500).send("Error setting cookie");
      }
    });
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
    const admin = await Admin.findById(decoded.admin.id);

    if (!admin) {
      return res.status(401).send("Admin not found");
    }
    res.status(200).json({ token, admin: { email: admin.email } });
  } catch (err) {
    console.log(err.message);
    // If verification fails (e.g., due to an invalid or expired token), send an error response
    return res.status(401).send("Invalid Token");
  }
};

export const changePassword = async (req, res) => {
  const token = req.cookies.token;
  try {
    const { password } = req.body;
    const decoded = jwt.verify(token, secret);
    const admin = await Admin.findById(decoded.admin.id);

    if (!admin) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      admin: {
        id: admin.id,
      },
    };

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save(); //saves to the database

    jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      try {
        res
          .cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000, // Expires in 1 hour (milliseconds)
            sameSite: "None", // Adjust this based on your security requirements
            secure: true, // Use secure cookies in production
            path: "/", // Set the path to your application root
          })
          .status(200)
          .json({ token, admin: { email: admin.email } });
      } catch (cookieError) {
        return res.status(500).send("Error setting cookie");
      }
    });
  } catch (err) {
    return res.status(500).send("Server Error " + err.message);
  }
};
