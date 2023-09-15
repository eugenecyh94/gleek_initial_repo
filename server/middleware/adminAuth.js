import jwt from "jsonwebtoken";
import "../loadEnvironment.js";
import Admin from "../model/adminModel.js";

const secret = process.env.JWT_SECRET || "";

const auth = async function (req, res, next) {
  try {
    const token = req.headers.authorization;
    const parts = token.split(" ");
    const decoded = jwt.verify(parts[1], secret);
    const admin = await Admin.findById(decoded.admin.id);
    if (!admin) {
      return res.status(401).send("Admin not found");
    }
    next();
  } catch (e) {
    return res.status(401).json({ ms: "Invalid Token Provided" + e.message });
  }
};

export default auth;
