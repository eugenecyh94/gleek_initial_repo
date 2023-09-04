import express from "express";
const router = express.Router();
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import "../loadEnvironment.js";

const secret = process.env.JWT_SECRET || "";

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).send("No users found!");
    }

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

//@route GET api/users
//@access Public
//@desc Register User
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(), //second argument is when the validation checks fail
    check("email", "Please enter valid email").isEmail(),
    check("password", "Minimum password length is 6").isLength({ min: 6 }),
  ],
  async (req, res) => {
    //the slash is the default route when the api endpoint hits the resource
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      let user = await User.findOne({ email }); //returns a promise

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists!" }] });
      }

      user = new User({
        //creates a new user instance but not saved in db until the user.save() is called
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save(); //saves to the database

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
