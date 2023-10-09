import mongoose from "mongoose";
import { ActivityApprovalStatusEnum } from "../util/activityApprovalStatusEnum.js";

const approvalStatusChangeLogSchema = new mongoose.Schema({
  approvalStatus: {
    type: String,
    enum: Object.values(ActivityApprovalStatusEnum),
    required: true,
  },
  date: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});
const ApprovalStatusChangeLog = mongoose.model(
  "ApprovalStatusChangeLog",
  approvalStatusChangeLogSchema,
);
export default ApprovalStatusChangeLog;
