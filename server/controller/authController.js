import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import "../loadEnvironment.js";

const secret = process.env.JWT_SECRET || "";
//@route GET api/auth
//@access Public
//@desc Test Route
router.get(
  "/",
  auth, //the slash is the default route when the api endpoint hits the resource
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");

      res.json(user);
    } catch (err) {
      return res.status(401).json();
    }
  },
);

//@route POST api/auth
//@access Public
//@desc Login User
router.post(
  "/",
  [
    check("email", "Please enter valid email").isEmail(),
    check("password", "Password is required ").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, secret, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      return res.status(500).send("Server Error");
    }
  },
);

export default router;
