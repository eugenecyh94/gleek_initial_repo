import express from "express";
import { addVendor, getAllVendors } from "../../controller/vendorController.js";
const router = express.Router();

router.post("/addVendor", addVendor);
router.get("/viewAllVendors", getAllVendors);

export default router;
