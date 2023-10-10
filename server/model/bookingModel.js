import mongoose from "mongoose";
// import { BookingStatusEnum } from "../util/bookingStatusEnum.js";
import { LOCATION } from "../util/activityTagEnum.js";

const bookingSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Activity",
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  // BOOKING INFORMATION (can be used for invoice generation)
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  totalPax: {
    type: Number,
    required: true,
  },
  basePricePerPax: {
    type: Number,
    required: true,
  },
  weekendAddOnCost: {
    type: Number,
    required: true,
  },
  onlineAddOnCost: {
    type: Number,
    required: true,
  },
  offlineAddOnCost: {
    type: Number,
    required: true,
  },
  activityTitle: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  eventLocationType: {
    type: String,
    required: true,
    enum: LOCATION,
  },
  additionalComments: {
    type: String,
  },
  // BILLING INFORMATION
  billingEmail: {
    type: String,
    required: true,
  },
  billingOfficePostalCode: {
    type: String,
    required: true,
  },
  billingPartyName: {
    type: String,
    required: true,
  },
  billingAddress: {
    type: String,
    required: true,
  },
  // STATUS AND META INFORMATION
  status: {
    type: String,
    required: true,
    enum: [
      "PENDING_CONFIRMATION",
      "CONFIRMED",
      "REJECTED",
      "CANCELLED",
      "PENDING PAYMENT",
      "PAID",
    ],
    default: "PENDING_CONFIRMATION",
  },
  creationDateTime: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  reviewedByAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  reviewedDateTime: {
    type: Date,
  },
  lastEditedByAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  lastEditedDateTime: {
    type: Date,
  },
});

const BookingModel = mongoose.model("Booking", bookingSchema, "bookings");
export default BookingModel;
