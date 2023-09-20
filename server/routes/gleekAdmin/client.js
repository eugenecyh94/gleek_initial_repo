import {
  getAllClients,
  updateClient,
} from "../../controller/manageClientController.js";
import express from "express";

const router = express.Router();
router.get("/getAllClients", getAllClients);
router.patch("/update/:id", updateClient);

export default router;
