import ActivityModel from "../model/activityModel.js";
import { s3GetImages } from "./s3ImageServices.js";

export async function findMinimumPricePerPax(foundActivity) {
  let minPricePerPax = Infinity;
  for (const pricingRule of foundActivity.activityPricingRules) {
    if (pricingRule.clientPrice < minPricePerPax) {
      minPricePerPax = pricingRule.clientPrice;
    }
  }
  return minPricePerPax;
}

export async function prepareActivityMinimumPricePerPaxAndSingleImage(
  activity
) {
  activity.minimumPricePerPax = await findMinimumPricePerPax(activity);
  if (activity.images && activity.images.length > 0) {
    const preSignedUrlArr = await s3GetImages([activity.images[0]]);
    activity.preSignedImages = preSignedUrlArr;
  }
}

export async function getAllVendorActivities(vendorId) {
  const activities = await ActivityModel.find({ linkedVendor: vendorId })
    .select("-clientMarkupPercentage")
    .populate("activityPricingRules")
    .populate("theme")
    .populate("subtheme")
    .populate({
      path: "linkedVendor",
      select: "-password",
    })
    .populate({
      path: "blockedTimeslots",
      options: { sort: { blockedStartDateTime: 1 } },
    })
    .populate({
      path: "approvalStatusChangeLog",
      populate: { path: "admin", model: "Admin", select: "_id name" },
    })
    .populate("rejectedDraft");
  return activities;
}
