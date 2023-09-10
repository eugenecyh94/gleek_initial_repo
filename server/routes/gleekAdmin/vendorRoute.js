import express from "express";
import {
  addVendor,
  deleteAllVendors,
  getAllVendors,
  getVendor,
} from "../../controller/vendorController.js";
const router = express.Router();

router.post("/addVendor", addVendor);
router.get("/viewAllVendors", getAllVendors);
router.get("/viewVendor/:id", getVendor);
router.post("/deleteAllVendors", deleteAllVendors);

export default router;
