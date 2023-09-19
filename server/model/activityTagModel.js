import { DURATION, LOCATION, SIZE, THEME, TYPE } from "../util/activityTagEnum";
import { FoodCategoryEnum } from "../util/foodCategoryEnum";
import { SustainableDevelopmentGoalsEnum } from "../util/sdgEnum";

const activityTagSchema = new mongoose.Schema({
  theme: { type: String, enum: THEME, required: true },
  activityType: { type: String, enum: TYPE, required: true },
  duration: { type: String, enum: DURATION, required: true },
  location: { type: String, enum: LOCATION, required: true },
  size: { type: String, enum: SIZE, required: true },
  sdg: {
    type: [String],
    enum: SustainableDevelopmentGoalsEnum,
  },
  foodCategory: {
    type: [String],
    enum: FoodCategoryEnum,
  },
});
const ActivityTagModel = mongoose.model(
  "ActivityTag",
  activityTagSchema,
  "activities",
);
export default ActivityTagModel;
