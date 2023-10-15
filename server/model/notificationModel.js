import mongoose from "mongoose";
import { Role } from "../util/roleEnum.js";
import {
  NotificationEvent,
  NotificationAction,
} from "../util/notificationRelatedEnum.js";

const notificationSchema = new mongoose.Schema({
  senderRole: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  //ID of notification sender
  sender: { type: mongoose.Schema.Types.ObjectId, required: true },
  //In cases of sending all admin some notification
  //e.g. activity created by vendor, user registration , booking status etc
  recipientRole: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  //ID of notification recipient
  //Not compulsory as some notifications might be directed for all admins
  recipient: { type: mongoose.Schema.Types.ObjectId },
  //To identify event to call appropriate controller / apis
  notificationEvent: {
    type: String,
    enum: Object.values(NotificationEvent),
    required: true,
  },
  notificationAction: {
    type: String,
    enum: Object.values(NotificationAction),
    required: true,
  },
  eventId: { type: mongoose.Schema.Types.ObjectId },
  eventObj: { type: Object },
  title: { type: String, require: true },
  text: { type: String, require: true },
  read: { type: Boolean, require: true, default: false },
  createdDate: {
    type: Date,
    required: true,
  },
});

const NotificationModel = mongoose.model(
  "Notification",
  notificationSchema,
  "notifications",
);
export default NotificationModel;
