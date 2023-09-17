import mongoose from "mongoose";
import { ActivityApprovalStatusEnum } from "../util/activityApprovalStatusEnum.js";
import { ActivityDayAvailabilityEnum } from "../util/activityDayAvailabilityEnum.js";
import { LOCATION, PPT_REQUIRED, SIZE, TYPE } from "../util/activityTagEnum.js";
import { FoodCategoryEnum } from "../util/foodCategoryEnum.js";
import { SustainableDevelopmentGoalsEnum } from "../util/sdgEnum.js";

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientMarkupPercentage: { type: Number, required: true },
  maxParticipants: { type: Number },
  theme: { type: mongoose.Schema.Types.ObjectId, ref: "Theme" },
  subtheme: [{ type: mongoose.Schema.Types.ObjectId, ref: "Theme" }],
  activityType: { type: String, enum: TYPE, required: true },
  duration: { type: Number, required: true },
  location: { type: String, enum: LOCATION, required: true },
  size: { type: String, enum: SIZE },
  sdg: {
    type: [String],
    enum: SustainableDevelopmentGoalsEnum,
  },
  dayAvailabilities: {
    type: [String],
    enum: ActivityDayAvailabilityEnum,
  },
  activityPricingRules: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ActivityPricingRules" },
  ],
  activityImages: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  approvedDate: Date,
  disabled: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: false },
  rating: Number,
  specialRequests: String,
  approvalStatus: {
    type: String,
    enum: Object.values(ActivityApprovalStatusEnum),
    required: true,
    default: ActivityApprovalStatusEnum.PUBLISHED,
  },
  // attributes for activity type "popup"
  isFoodCertPending: { type: Boolean },
  pendingCertificationType: { type: String },
  foodCertDate: { type: Date },
  foodCategory: {
    type: [String],
    enum: FoodCategoryEnum,
  },
  isPowerpointRequired: { type: String, enum: Object.values(PPT_REQUIRED) },
  popupItemsSold: { type: String },
});

const ActivityModel = mongoose.model("Activity", activitySchema, "activities");
export default ActivityModel;
