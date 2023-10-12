import ActivityModel from "../model/activityModel.js";
import BlockedTimeslotModel from "../model/blockedTimeslotModel.js";
import { addBlockedTimeslotForActivity } from "../service/blokedTImeslotService.js";
import mongoose from "mongoose";

export const getBlockedTimeslotsByActivityId = async (req, res) => {
  try {
    const { activityId } = req.params;
    const blockedTimeslots = await BlockedTimeslotModel.find({
      activityId,
    }).sort({ blockedStartDateTime: 1 });
    res.status(200).json(blockedTimeslots);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server Error! Blocked timeslots cannot be fetched.",
      message: error.message,
    });
  }
};

export const addBlockedTimeslot = async (req, res) => {
  try {
    const { activityId, blockedStartDateTime, blockedEndDateTime } = req.body;
    console.log(blockedStartDateTime, blockedEndDateTime);
    const blockedTimeslot = new BlockedTimeslotModel({
      activityId,
      blockedStartDateTime,
      blockedEndDateTime,
    });

    await blockedTimeslot.save();

    const updateActivity = await ActivityModel.findById(activityId);

    updateActivity.blockedTimeslots.push({ _id: blockedTimeslot._id });
    await updateActivity.save();


    const blockedTimeslots = await BlockedTimeslotModel.find({
      activityId,
    }).sort({ blockedStartDateTime: 1 });

    res.status(200).json({
      message: "Blocked timing added successfully.",
      blockedTimeslots,
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
    console.log(blockedStartDateTime, blockedEndDateTime);
    let blockedTimeslots = [];

    for (const activityId of activityIds) {
      const updateActivity = await ActivityModel.findById(activityId);
      if (!updateActivity.linkedVendor.equals(vendor._id)) {
        console.log(updateActivity.linkedVendor);
        console.log(vendor._id);
        throw Error("Activity does not belong to you.");
      }

      const createdBlockedTimeslot = await addBlockedTimeslotForActivity(
        activityId,
        blockedStartDateTime,
        blockedEndDateTime,
        session,
      );

      updateActivity.blockedTimeslots.push({ _id: createdBlockedTimeslot._id });
      await updateActivity.save();

      blockedTimeslots.push(createdBlockedTimeslot);
    }

    await session.commitTransaction();
    session.endSession();
    const activities = await ActivityModel.find({ linkedVendor: vendor._id })
      .populate("activityPricingRules")
      .populate("theme")
      .populate("subtheme")
      .populate("linkedVendor")

      .populate({
        path: "blockedTimeslots",
        options: { sort: { blockedStartDateTime: -1 } },
      });

    res.status(200).json({
      message: "Blocked timeslots added successfully.",
      activities,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Blocked timeslots cannot be added.",
      message: error.message,
    });
  }
};

export const deleteBlockedTimeslot = async (req, res) => {
  try {
    const { blockedTimingId } = req.params;

    const blockedTiming =
      await BlockedTimeslotModel.findById(blockedTimingId).populate(
        "activityId",
      );

    if (!blockedTiming) {
      return res.status(404).json({
        error: "Blocked timing not found.",
      });
    }

    const user = req.user;
    console.log(blockedTiming.activityId.linkedVendor);
    console.log(user._id);

    if (!blockedTiming.activityId.linkedVendor.equals(user._id)) {
      return res.status(403).json({
        error: "Forbidden. You do not own this activity.",
      });
    }

    const deleted =
      await BlockedTimeslotModel.findByIdAndDelete(blockedTimingId);

    res.status(200).json({
      message: "Blocked timing deleted successfully.",
      deleted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error! Blocked timing cannot be deleted.",
      message: error.message,
    });
  }
};

// Delete multiple blocked timeslots
export const deleteMultipleBlockedTimeslots = async (req, res) => {
  try {
    const { blockedTimingIds, activityId } = req.body;

    const deletedStatus = await BlockedTimeslotModel.deleteMany({
      _id: { $in: blockedTimingIds },
    });
    const blockedTimeslots = await BlockedTimeslotModel.find({
      activityId,
    }).sort({ blockedStartDateTime: 1 });

    res.status(200).json({
      message: "Blocked timings deleted successfully.",
      deletedStatus,
      blockedTimeslots,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error! Blocked timings cannot be deleted.",
      message: error.message,
    });
  }
};
