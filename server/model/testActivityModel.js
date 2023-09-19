import mongoose from "mongoose";

const activityTestSchema = mongoose.Schema({
  activityName: { type: String, required: true },
  images: {
    type: Array,
  },
});

const TestActivityModel = mongoose.model(
  "ActivityTest",
  activityTestSchema,
  "activitiesTest",
);
export default TestActivityModel;
