import mongoose from "mongoose";
const themeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theme",
    default: null,
  },
});
const ThemeModel = mongoose.model("Theme", themeSchema);
export default ThemeModel;
