import {
   getAllClients,
   updateClient,
   getClientDetails,
} from "../../controller/manageClientController.js";
import express from "express";
import adminAuth from "../../middleware/adminAuth.js";

const router = express.Router();
router.get("/getAllClients", adminAuth, getAllClients);
router.patch("/update/:id", adminAuth, updateClient);
router.get("/getClientDetails/:clientId", adminAuth, getClientDetails);

export default router;
