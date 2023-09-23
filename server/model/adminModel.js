import mongoose from "mongoose";
import { Role } from "../util/roleEnum.js";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  role: {
    type: String,
    required: true,
    enum: Role,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
});
const Admin = mongoose.model("Admin", adminSchema, "admins");

export default Admin;
