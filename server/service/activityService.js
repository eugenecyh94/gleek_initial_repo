import { s3ImageGetService } from "./s3ImageGetService.js";

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
    const preSignedUrlArr = await s3ImageGetService([activity.images[0]]);
    activity.preSignedImages = preSignedUrlArr;
  }
}
