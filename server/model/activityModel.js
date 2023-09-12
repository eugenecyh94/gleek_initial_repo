import mongoose from "mongoose";
import { ActivityApprovalStatusEnum } from "../util/activityApprovalStatusEnum.js";
import { ActivityDayAvailabilityEnum } from "../util/activityDayAvailabilityEnum.js";
import { PPT_REQUIRED } from "../util/activityTagEnum.js";
import { FoodCategoryEnum } from "../util/foodCategoryEnum.js";

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientMarkupPercentage: { type: Number, required: true },
  maxParticipants: { type: Number, required: true },
  minParticipants: { type: Number, required: true },
  activityTag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActivityTag",
  },
  activityPricingRules: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActivityPricingRules",
  },
  dayAvailabilities: {
    type: [String],
    enum: ActivityDayAvailabilityEnum,
  },
  activityImages: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
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
  duration: { type: Number, required: true },
  // attributes for activity type "popup"
  foodCategory: {
    type: String,
    enum: FoodCategoryEnum,
  },
  isFoodCertPending: { type: Boolean },
  pendingCertificationType: { type: String },
  foodCertDate: { type: Date },
  isPowerpointRequired: { type: String, enum: Object.values(PPT_REQUIRED) },
  popupItemsSold: { type: String },
});

const ActivityModel = mongoose.model("Activity", activitySchema, "activities");
export default ActivityModel;
