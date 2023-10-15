import CartItemModel from "../model/cartItemModel.js";
import { validationResult } from "express-validator";
import ActivityModel from "../model/activityModel.js";
import BookingModel from "../model/bookingModel.js";
import BlockedTimeslotModel from "../model/blockedTimeslotModel.js";
import { s3GetImages } from "../service/s3ImageServices.js";
import {
  getTimeslotAvailability,
  generateAllTimeslots,
} from "./bookingController.js";

export const addCartItem = async (req, res) => {
  const errors = validationResult(req);

  const client = req.user;
  console.log("Client", client);

  if (!errors.isEmpty()) {
    // 422 status due to validation errors
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const {
      activityId,
      totalPax,
      basePricePerPax,
      weekendAddOnCost,
      onlineAddOnCost,
      offlineAddOnCost,
      ...restBody
    } = req.body;
    // Check if client is approved to make bookings
    if (client.status !== "APPROVED") {
      return res.status(400).json({
        status: "error",
        msg: "Client is not approved to make bookings yet.",
      });
    }

    // Check if activity exists
    const activity =
      await ActivityModel.findById(activityId).populate("linkedVendor");

    if (activity === null) {
      return res.status(404).json({
        status: "error",
        msg: "Activity not found with the provided ID.",
      });
    }

    // Get activity title and vendor name
    const activityTitle = activity.title;
    const vendorName = activity.linkedVendor.companyName;

    // Calculate total cost
    const totalCost =
      basePricePerPax * totalPax +
      weekendAddOnCost +
      onlineAddOnCost +
      offlineAddOnCost;

    const newCartItem = new CartItemModel({
      clientId: client.id,
      activityId,
      totalPax,
      basePricePerPax,
      weekendAddOnCost,
      onlineAddOnCost,
      offlineAddOnCost,
      totalCost,
      activityTitle,
      vendorName,
      ...restBody,
    });

    await newCartItem.save();
    res.status(200).json({
      message: "Activity added to cart successfully.",
      cartItem: newCartItem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server Error! Activity cannot be added to cart.",
      message: error.message,
    });
  }
};

export const getCartItemsByClientId = async (req, res) => {
  const errors = validationResult(req);

  const client = req.user;
  console.log("Client", client);

  if (!errors.isEmpty()) {
    // 422 status due to validation errors
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const cartItems = await CartItemModel.find({
      clientId: client._id,
    });
    // for each cartItem, check if the activity is still available
    for (const cartItem of cartItems) {
      const activity = await ActivityModel.findById(cartItem.activityId);
      cartItem.preSignedImages = await s3GetImages(activity.images);
    }
    const updatedCartItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const isTimeslotAvailable = await isCartItemStillAvailable(
          cartItem._id,
        );
        return { cartItem, isItemStillAvailable: isTimeslotAvailable }; // Add the 'isAvailable' field to the updated cart items
      }),
    );

    res.status(200).json(updatedCartItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server Error! Cart items cannot be retrieved.",
      message: error.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  const errors = validationResult(req);

  const client = req.user;
  console.log("Client", client);

  if (!errors.isEmpty()) {
    // 422 status due to validation errors
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const cartItemId = req.params.cartItemId;
    const cartItem = await CartItemModel.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        error: "Cart item not found with the provided ID.",
      });
    }
    if (!cartItem.clientId.equals(client._id)) {
      return res.status(400).json({
        error: "Cart item does not belong to you.",
      });
    }
    await CartItemModel.findByIdAndDelete(cartItemId);
    res.status(200).json({
      message: "Cart item deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server Error! Cart item cannot be deleted.",
      message: error.message,
    });
  }
};

export async function isCartItemStillAvailable(cartItemId) {
  const cartItem = await CartItemModel.findById(cartItemId);
  const activity = await ActivityModel.findById(cartItem.activityId);

  const earliestStartTime = new Date(cartItem.startDateTime);
  earliestStartTime.setHours(
    activity.startTime.getHours(),
    activity.startTime.getMinutes(),
    0,
    0,
  );
  const latestStartTime = new Date(cartItem.startDateTime);
  latestStartTime.setHours(
    activity.endTime.getHours(),
    activity.endTime.getMinutes(),
    0,
    0,
  );

  const interval = 30; // 30 minutes

  const startOfDay = new Date(cartItem.startDateTime);
  startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00.000 of the selected day

  const endOfDay = new Date(cartItem.startDateTime);
  endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999 of the selected day

  // Get activity's bookings for the selected date
  const bookings = await BookingModel.find({
    activityId: cartItem.activityId,
    startDateTime: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  // Get activities blocked timeslots for the selected date
  const blockedTimeslots = await BlockedTimeslotModel.find({
    activityId: cartItem.activityId,
    blockedStartDateTime: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  const allTimeslots = await generateAllTimeslots(
    earliestStartTime,
    latestStartTime,
    interval,
    activity.capacity,
    bookings,
    blockedTimeslots,
    activity.duration,
  );

  // use isTimeslotAvailable
  const isTimeslotAvailable = await getTimeslotAvailability(
    allTimeslots,
    cartItem.startDateTime,
    cartItem.endDateTime,
  );
  return isTimeslotAvailable;
}
