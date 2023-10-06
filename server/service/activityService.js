import { s3GetImages } from "./s3ImageServices.js";

export async function findMinimumPricePerPax(foundActivity) {
  let minPricePerPax = Infinity;
  for (const pricingRule of foundActivity.activityPricingRules) {
    if (pricingRule.pricePerPax < minPricePerPax) {
      minPricePerPax = pricingRule.pricePerPax;
    }
  }
  return minPricePerPax;
}

export async function prepareActivityMinimumPricePerPaxAndSingleImage(activity) {
  activity.minimumPricePerPax = await findMinimumPricePerPax(activity);
  if (activity.images && activity.images.length > 0) {
    const preSignedUrlArr = await s3GetImages([activity.images[0]]);
    activity.preSignedImages = preSignedUrlArr;
  }
}
