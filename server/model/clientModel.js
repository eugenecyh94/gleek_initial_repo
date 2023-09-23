import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  jobTitle: { type: String, required: false },
  team: { type: String, required: false },
  companyName: { type: String, required: false },
  officeAddress: { type: String, required: false },
  officePostalCode: { type: Number, required: false },
  billingPartyName: { type: String, required: false },
  billingAddress: { type: String, required: false },
  billingOfficePostalCode: { type: Number, required: false },
  billingEmail: { type: String, required: false },
  signupDate: { type: Date, required: false },
  approvedDate: { type: Date, required: false },
  emergencyContactName: { type: String, required: false },
  emergencyContactNumber: { type: String, required: false },
  photo: { type: String, required: false },
  preSignedPhoto: { type: String, required: false },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    required: false,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const ClientModel = mongoose.model("Client", clientSchema, "clients");
export default ClientModel;
