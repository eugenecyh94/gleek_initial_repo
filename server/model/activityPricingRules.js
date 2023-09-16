import mongoose from "mongoose";
import { PaxIntervalEnum } from "../util/paxIntervalEnum.js";

const activityPricingRulesSchema = new mongoose.Schema({
  paxInterval: {
    type: String,
    enum: PaxIntervalEnum,
  },
  pricePerPax: {
    type: Number,
    required: true,
  },
  weekendAddon: Number,
  publicHolidayAddon: Number,
  onlineAddon: Number,
  offlineAddon: Number,
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
});
const ActivityPricingRulesModel = mongoose.model(
  "ActivityPricingRules",
  activityPricingRulesSchema
);
export default ActivityPricingRulesModel;