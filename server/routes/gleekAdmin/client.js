import { getAllClients } from "../../controller/manageClientController.js";
import express from "express";

const router = express.Router();
router.get(
  "/getAllClients",
  getAllClients
);

export default router;
