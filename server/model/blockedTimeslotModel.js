import mongoose from "mongoose";

const blockedTimeslotSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Activity",
  },
  blockedStartDateTime: {
    type: Date,
    required: true,
  },
  blockedEndDateTime: {
    type: Date,
    required: true,
  },
});

const BlockedTimeslotModel = mongoose.model(
  "BlockedTimeslot",
  blockedTimeslotSchema,
<<<<<<< HEAD
  "blockedTimeslots",
=======
  "blockedtimeslots",
>>>>>>> develop-2
);
export default BlockedTimeslotModel;
