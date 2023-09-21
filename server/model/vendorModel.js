import mongoose from "mongoose";
import { VendorTypeEnum } from "../util/vendorTypeEnum.js";

const vendorSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyUEN: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  companyPhoneNumber: {
    type: Number,
    required: true,
  },
  vendorType: {
    type: String,
    enum: Object.values(VendorTypeEnum),
    required: true,
  },
  customCompanyType: {
    type: String,
    required: false,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  brandNames: [
    {
      type: String,
    },
  ],
  vendorDetails: {
    type: String,
  },
  companyLogo: {
    type: String,
  },
  companySocials: {
    type: Map,
    of: String,
  },
  signupDate: {
    type: Date,
    default: Date.now,
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  approvedDate: {
    type: Date,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    required: false,
  },
  adminCreated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

const VendorModel = mongoose.model("Vendor", vendorSchema);

export default VendorModel;
