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
  activity,
) {
  activity.minimumPricePerPax = await findMinimumPricePerPax(activity);
  if (activity.images && activity.images.length > 0) {
    const preSignedUrlArr = await s3GetImages([activity.images[0]]);
    activity.preSignedImages = preSignedUrlArr;
  }
}

export async function getAllVendorActivities(vendorId) {
  const activities = await ActivityModel.find({ linkedVendor: vendorId })
    .populate("activityPricingRules")
    .populate("theme")
    .populate("subtheme")
    .populate("linkedVendor")
    .populate("blockedTimeslots");
  return activities;
}
