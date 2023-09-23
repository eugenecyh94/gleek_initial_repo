import {
  getAllClients,
  updateClient,
  getClientDetails,
} from "../../controller/manageClientController.js";
import express from "express";

const router = express.Router();
router.get("/getAllClients", getAllClients);
router.patch("/update/:id", updateClient);
router.get("/getClientDetails/:clientId", getClientDetails);

export default router;
