import express from "express";
import {
  addCartItem,
  deleteCartItem,
  getCartItemsByClientId,
} from "../../controller/cartItemController.js";
import { verifyToken } from "../../middleware/clientAuth.js";

const router = express.Router();

// Cart
// /gleek/cart/addCartItem
// request body of addCartItem expects:
// {
// "activityId" : "60b9b6b9e6b3a83a3c3b3b3b",
// "startDateTime" : "2023-12-04T00:00:00.000Z",
// "endDateTime" : "2023-12-04T02:00:00.000Z",
// "basePricePerPax" : 50,
// "totalPax" : 5,
// "weekendAddOnCost" : 10,
// "onlineAddOnCost" : 0,
// "offlineAddOnCost" : 10,
// "eventLocationType" : "Virtual (online sessions)",
// "additionalComments" : "Test Comments"
//   }
router.post("/addCartItem", verifyToken, addCartItem);

// /gleek/cart/getCartItemsByClientId
router.get("/getCartItemsByClientId", verifyToken, getCartItemsByClientId);

// /gleek/cart/deleteCartItem/:cartItemId
router.delete("/deleteCartItem/:cartItemId", verifyToken, deleteCartItem);
export default router;
