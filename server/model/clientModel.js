import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: { type: String, required: false },
  phoneNumber: { type: Number, required: false },
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
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    required: false,
  },
});

const ClientModel = mongoose.model("Client", clientSchema, "clients");
export default ClientModel;
