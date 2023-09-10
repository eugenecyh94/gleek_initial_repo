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

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.find();
    return res.status(201).json(vendors);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};

export const getVendor = async (req, res) => {
  try {
    console.log(req.params.id);
    const vendor = await VendorModel.findById(req.params.id);
    return res.status(201).json(vendor);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};

export const deleteAllVendors = async (req, res) => {
  try {
    const deleteRes = await VendorModel.deleteMany({});
    return res.status(200).json(deleteRes);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};

export const updateVendor = async (req, res) => {
  try {
    const updateData = req.body;
    const updatedVendor = await VendorModel.findOneAndUpdate(
      { _id: req.params.id },
      { ...updateData },
      { new: true }
    );
    return res.status(201).json(updatedVendor);
  } catch (e) {
    console.log(e);
    res.status(500).json("Server Error");
  }
};
