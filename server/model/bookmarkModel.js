import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    default: null,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    default: null,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    default: null,
    required: true,
  },
  isBookmarked: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["ACTIVITY", "VENDOR"],
    required: true,
  },
});

const BookmarkModel = mongoose.model("Bookmark", bookmarkSchema, "bookmarks");
export default BookmarkModel;
