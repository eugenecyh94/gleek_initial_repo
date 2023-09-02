import jwt from "jsonwebtoken";
import "../loadEnvironment.js";
import express from "express";
import { model } from "mongoose";

const secret = process.env.JWT_SECRET || "";

const auth = async function (req, res, next) {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(401).json({ ms: "No Token Provided" });

      const decoded = await jwt.verify(token, secret);

      req.user = decoded.user;
      next();
    }
  } catch (e) {
    return res.status(401).json({ ms: "Invalid Token Provided" });
  }
};

export default auth;
