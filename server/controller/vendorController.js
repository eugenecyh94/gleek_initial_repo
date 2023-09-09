import VendorModel from "../model/vendorModel.js";

export const addVendor = async (req, res) => {
  try {
    const newVendor = new VendorModel({ ...req.body });
    await newVendor.save();

    return res.status(201).json(newVendor);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create vendor" });
  }
};
