import express from "express";
import {
  addVendor,
  deleteAllVendors,
  disableVendor,
  getAllVendors,
  getVendor,
} from "../../controller/vendorController.js";
const router = express.Router();

router.post("/addVendor", addVendor);
router.get("/viewAllVendors", getAllVendors);
router.get("/viewVendor/:id", getVendor);
router.post("/deleteAllVendors", deleteAllVendors);
router.post("/disableVendor/:id", disableVendor);

export default router;
