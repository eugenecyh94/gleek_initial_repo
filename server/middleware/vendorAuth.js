import jwt from "jsonwebtoken";
import VendorModel from "../model/vendorModel.js";

const secret = process.env.JWT_SECRET_VENDOR;

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = await jwt.verify(token, secret);

    // Example: Fetch user data from a database asynchronously
    const user = await VendorModel.findById(decoded.vendor.id);

    if (!user) {
      return res.status(401).send("Vendor not found");
    }

    // Attach user data to the request
    req.user = user;

    // Continue to the next middleware
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

export default verifyToken;
