import jwt from "jsonwebtoken";
import Admin from "../model/adminModel.js";

const secret = process.env.JWT_SECRET;

const adminAuth = async function (req, res, next) {
   try {
      const token =
         req.cookies.token ||
         req.body.token ||
         req.query.token ||
         req.headers["x-access-token"];

      if (!token) {
         return res.status(401).send("No Token Provided");
      }

      const decoded = await jwt.verify(token, secret);

      const user = await Admin.findById(decoded.admin.id);

      if (!user) {
         return res.status(401).send("Admin not Found");
      }

      req.user = user;
      next();
   } catch (e) {
      return res.status(401).send("Invalid Token Provided");
   }
};

export default adminAuth;
