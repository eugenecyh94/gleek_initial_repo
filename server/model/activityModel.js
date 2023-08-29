import mongoose from "mongoose";

const activitySchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: {
    theme: [{ type: String, required: true }],
    type: [{ type: String, required: true }],
    duration: { type: String, required: true },
    location: [{ type: String, required: true }],
    size: [{ type: String, required: true }],
  },
  //TODO
  //customise price based on criteria given by Suzanna
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const ActivityModel = mongoose.model("Activity", activitySchema, "activities");
export default ActivityModel;
