import mongoose from "mongoose";
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
});
const Admin = mongoose.model("Admin", adminSchema, "admins");

export default Admin;
