import BlockedTimeslotModel from "../model/blockedTimeslotModel.js";

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
      activityId,
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
