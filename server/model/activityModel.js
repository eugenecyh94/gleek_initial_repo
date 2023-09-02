import mongoose from "mongoose";

const activitySchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: {
    theme: { type: Array, required: true },
    type: { type: Array, required: true },
    duration: { type: String, required: true },
    location: { type: Array, required: true },
    size: { type: Array, required: true },
  },
  //TODO
  //customise price based on criteria given by Suzanna
  price: { type: Number, required: true },
  //TODO
  //to change to list if multiple images required
  image: { type: String, required: true },
});

const ActivityModel = mongoose.model("Activity", activitySchema, "activities");
export default ActivityModel;
