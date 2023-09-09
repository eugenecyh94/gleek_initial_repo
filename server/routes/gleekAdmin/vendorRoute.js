import express from "express";
import { addVendor } from "../../controller/vendorController.js";
const router = express.Router();

router.post("/addVendor", addVendor);

export default router;
