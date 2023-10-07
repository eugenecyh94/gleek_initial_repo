import Vendor from "../model/vendorModel.js";
import bcrypt from "bcryptjs";
import { s3GetImages } from "./s3ImageServices.js";

export const vendorExists = async (companyEmail) => {
  const oldVendor = await Vendor.findOne({ companyEmail });
  return !!oldVendor;
};

export const createVendor = async (newVendor, session) => {
  const vendorData = {
    companyEmail: newVendor.companyEmail,
    ...newVendor,
    signupDate: Date.now(),
    status: "PENDING",
  };
  // Need to pass newClient in an array as we are passing in session
  // See: https://mongoosejs.com/docs/api/model.html#Model.create()
  const create = await Vendor.create([vendorData], { session: session });

  return create[0];
};

export const encryptUserPassword = async (vendor, password) => {
  const salt = await bcrypt.genSalt(10);
  vendor.password = await bcrypt.hash(password, salt);
  return vendor.save();
};

export async function prepareCompanyLogoImage(vendor) {
  if (vendor.companyLogo) {
    const preSignedUrl = await s3GetImages(vendor.companyLogo);
    vendor.preSignedPhoto = preSignedUrl;
  }
}
