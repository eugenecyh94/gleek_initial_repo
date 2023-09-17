const activityPricingRulesSchema = new mongoose.Schema({
  minParticipantBasePrice: {
    type: Number,
    required: true,
  },
  maxParticipantBasePrice: {
    type: Number,
    required: true,
  },
  weekendAddon: Number,
  publicHolidayAddon: Number,
  onlineAddon: Number,
  offlineAddon: Number,
});
const ActivityPricingRulesModel = mongoose.model(
  "ActivityPricingRules",
  activityPricingRulesSchema
);
export default ActivityPricingRulesModel;
