import mongoose from "mongoose";

const activityPricingRulesSchema = new mongoose.Schema({
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
  },
  pricePerPax: {
    type: Number,
    required: true,
  },
  clientPrice: {
    type: Number,
    required: true,
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
});
const ActivityPricingRulesModel = mongoose.model(
  "ActivityPricingRules",
  activityPricingRulesSchema,
);
export default ActivityPricingRulesModel;
