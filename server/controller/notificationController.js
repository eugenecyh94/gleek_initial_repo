import NotificationModel from "../model/notificationModel.js";
import {
  NotificationAction,
  NotificationEvent,
} from "../util/notificationRelatedEnum.js";
import { Role } from "../util/roleEnum.js";
import ActivityModel from "../model/activityModel.js";
import ClientModel from "../model/clientModel.js";
import VendorModel from "../model/vendorModel.js";
import AdminModel from "../model/adminModel.js";
import BookingModel from "../model/bookingModel.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const adminId = req.adminId;
    const adminRole = req.adminRole; //in case theres any need to filter between mnger and exec exclusive notifications
    const allNotifications =
      adminRole === Role.EXECUTIVE
        ? await NotificationModel.find().or([
            { recipient: adminId },
            { recipientRole: Role.ADMIN },
            { recipientRole: Role.EXECUTIVE },
          ])
        : await NotificationModel.find().or([
            { recipient: adminId },
            { recipientRole: Role.ADMIN },
            { recipientRole: Role.MANAGERIAL },
          ]);

    res.status(200).json({
      data: allNotifications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNonAdminNotifications = async (req, res) => {
  try {
    const recipientId = req.user._id;
    const allNotifications = await NotificationModel.find({
      recipient: recipientId,
    });

    res.status(200).json({
      data: allNotifications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    console.log("req in notification controller:", req);

    const newNotification = new NotificationModel({
      senderRole: req.senderRole,
      sender: req.sender._id,
      recipientRole: req.recipientRole,
      recipient: req.recipient ? req.recipient : undefined,
      notificationEvent: req.notificationEvent,
      notificationAction: req.notificationAction,
      eventId: req.eventId ? req.eventId : undefined,
      createdDate: Date.now(),
    });

    switch (req.notificationEvent) {
      case NotificationEvent.REGISTER:
        newNotification.title = "Registration Notification";
        newNotification.text = `
        There is a new ${req.senderRole.toLowerCase()} 
        account registration for 
        ${
          req.senderRole === Role.CLIENT
            ? req.sender.name.toUpperCase()
            : req.sender.companyName.toUpperCase()
        }
        (${
          req.senderRole === Role.CLIENT
            ? req.sender.email
            : req.sender.companyEmail
        }) 
        awaiting your review`;
        break;
      case NotificationEvent.ACTIVITY:
        const activityEvent = await ActivityModel.findById(
          req.eventId,
        ).populate("linkedVendor");
        newNotification.title = "Activity Notification";
        if (req.notificationAction === NotificationAction.APPROVE) {
          newNotification.text = `
          ${req.senderRole === Role.VENDOR ? "Vendor" : "Admin"} 
          ${
            req.senderRole === Role.VENDOR
              ? req.sender.companyName.toUpperCase()
              : req.sender.name.toUpperCase()
          } 
          is requesting approval to publish ${activityEvent.title} for viewing.
          `;
        }
        break;
      //To be uncommented when booking is implemented
      // case NotificationEvent.BOOKING:
      //     const bookingEvent = BookingModel.findById(req.eventId).populate("client").populate("activity");
      //     newNotification.title = "Booking Notification";
      //     newNotification.text =
      //         `A booking for activity ${bookingEvent.activity.title} is ${req.notificationAction.toLowerCase()}ed by
      //         ${req.senderRole}.`;
      //     break;
    }

    console.log("new notification after save:", newNotification);

    newNotification.save();
  } catch (error) {
    console.log("notification error", error);
  }
};
