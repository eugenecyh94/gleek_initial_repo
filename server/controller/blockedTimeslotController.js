import mongoose from "mongoose";
import ActivityModel from "../model/activityModel.js";
import BlockedTimeslotModel from "../model/blockedTimeslotModel.js";
import { addBlockedTimeslotForActivity } from "../service/blokedTImeslotService.js";

// GET /gleek/timeslot/getBlockedTimeslotsByActivityId/:activityId
export const getBlockedTimeslotsByActivityId = async (req, res) => {
  try {
    const { activityId } = req.params;
    const blockedTimeslots = await BlockedTimeslotModel.find({ activityId });
    res.status(200).json({
      blockedTimeslots,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server Error! Blocked timeslots cannot be fetched.",
      message: error.message,
    });
  }
};

// POST /gleek/timeslot/addBlockedTimeslot
// Request body expects:
// {
//   "activityId": "60b9a9f9f0a6a93c4c0e4e8d",
//   "blockedStartDateTime": "2021-06-06T00:00:00.000Z",
//   "blockedEndDateTime": "2021-06-06T01:00:00.000Z"
// }
export const addBlockedTimeslot = async (req, res) => {
  try {
    const { activityId, blockedStartDateTime, blockedEndDateTime } = req.body;
    const blockedTimeslot = new BlockedTimeslotModel({
      activity: activityId,
      blockedStartDateTime,
      blockedEndDateTime,
    });
    await blockedTimeslot.save();
    res.status(200).json({
      message: "Blocked timeslot added successfully.",
      blockedTimeslot,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server Error! Blocked timeslot cannot be added.",
      message: error.message,
    });
  }
};
// 1 timeslot for multiple activities
export const addBlockedTimeslotMultipleActivities = async (req, res) => {
  try {
    const vendor = req.user;

    const session = await mongoose.startSession();
    session.startTransaction();
    const { activityIds, blockedStartDateTime, blockedEndDateTime } = req.body;
    let blockedTimeslots = [];

    for (const activityId of activityIds) {
      const updateActivity = await ActivityModel.findById(activityId);
      if (!updateActivity.linkedVendor.equals(vendor._id)) {
        console.log(updateActivity.linkedVendor)
        console.log(vendor._id)
        throw Error("Activity does not belong to you.");
      }

      const createdBlockedTimeslot = await addBlockedTimeslotForActivity(
        activityId,
        blockedStartDateTime,
        blockedEndDateTime,
      );

      console.log("createdBlockedTimeslot", createdBlockedTimeslot);

      updateActivity.blockedTimeslots.push({ _id: createdBlockedTimeslot._id });
      updateActivity.save();

      blockedTimeslots.push(createdBlockedTimeslot);
    }

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      message: "Blocked timeslots added successfully.",
      blockedTimeslots,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Blocked timeslots cannot be added.",
      message: error.message,
    });
  }
};
