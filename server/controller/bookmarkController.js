import Bookmark from "../model/bookmarkModel.js";
import { BookmarkEnum } from "../util/gleek/bookmarkEnum.js";

export const fetchBookmarks = async (req, res) => {
  try {
    const client = req.user;

    const bookmarks = await Bookmark.find({ client })
      .populate({
        path: "vendor",
        select: "companyName vendorDetails",
      })
      .populate({
        path: "activity",
        select: "title description",
      })
      .sort("-created");

    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

export const updateBookmark = async (req, res) => {
  try {
    const { activity, vendor, isBookmarked } = req.body;
    const client = req.user;
    let update = {
      isBookmarked,
      updated: Date.now(),
    };

    let query = {
      client: client._id,
    };

    if (activity) {
      update.activity = activity;
      query.activity = activity;
    } else if (vendor) {
      update.vendor = vendor;
      query.vendor = vendor;
    }

    const updatedBookmark = await Bookmark.findOneAndUpdate(query, update, {
      new: true,
    });

    if (updatedBookmark !== null) {
      res.status(200).json({
        success: true,
        msg: "Your Bookmarks have been updated successfully!",
        boookmark: updatedBookmark,
      });
    } else {
      let bookmark;

      if (activity) {
        bookmark = new Bookmark({
          activity,
          isBookmarked,
          type: BookmarkEnum.ACTIVITY,
          client: client._id,
        });
      } else if (vendor) {
        bookmark = new Bookmark({
          vendor,
          isBookmarked,
          type: BookmarkEnum.VENDOR,
          client: client._id,
        });
      }

      const bookmarkDoc = await bookmark.save();

      res.status(200).json({
        success: true,
        msg: `Added to your Bookmark successfully!`,
        boookmarks: bookmarkDoc,
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};
