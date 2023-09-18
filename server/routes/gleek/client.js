import express from "express";
import {
  postChangePassword,
  updateClientAccountDetails,
} from "../../controller/clientController.js";

import verifyToken from "../../middleware/clientAuth.js";
const router = express.Router();

router.post("/changePassword", verifyToken, postChangePassword);

router.patch("/updateAccount", verifyToken, updateClientAccountDetails);

export default router;
