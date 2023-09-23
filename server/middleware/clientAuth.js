import jwt from "jsonwebtoken";
import Client from "../model/clientModel.js";

const secret = process.env.JWT_SECRET_ClIENT;

export const verifyToken = async (req, res, next) => {
  const token =
    req.cookies.token ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = await jwt.verify(token, secret);

    // Example: Fetch user data from a database asynchronously
    const user = await Client.findById(decoded.client.id);

    if (!user) {
      return res.status(401).send("Client not found");
    }

    // Attach user data to the request
    req.user = user;

    // Continue to the next middleware
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};
