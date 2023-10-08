import Bookmark from "../model/bookmarkModel.js";
import { prepareActivityMinimumPricePerPaxAndSingleImage } from "../service/activityService.js";
import { prepareCompanyLogoImage } from "../service/vendorService.js";
import { BookmarkEnum } from "../util/gleek/bookmarkEnum.js";

export const fetchBookmarks = async (req, res) => {
  try {
    const client = req.user;

    const bookmarks = await Bookmark.find({ client, isBookmarked: true })
      .populate({
        path: "vendor",
      })
      .populate({
        path: "activity",
        populate: {
          path: "linkedVendor activityPricingRules",
        },
      })
      .sort("-created");

    console.log(bookmarks[0]);

    const preSignedPromises = bookmarks.map(async (bm) => {
      if (bm.activity) {
        await prepareActivityMinimumPricePerPaxAndSingleImage(bm.activity);
      }
      else if (bm.vendor) {
        await prepareCompanyLogoImage(bm.vendor);
      }
    });

    await Promise.all(preSignedPromises);

    console.log(bookmarks);

    res.status(200).json(bookmarks);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

export const getActivityBookmark = async (req, res) => {
  try {
    const client = req.user;
    const { activityId } = req.params;

    const bookmark = await Bookmark.findOne({
      activity: activityId,
      client: client._id,
    });

    res.status(200).json(bookmark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getActivityBookmarkStatus = async (req, res) => {
  try {
    const client = req.user;
    const { activityId } = req.params;

    const bookmark = await Bookmark.findOne({
      activity: activityId,
      client: client._id,
    });

    return bookmark
      ? res.status(200).json(bookmark.isBookmarked)
      : res.status(200).json(false);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateActivityBookmark = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { isBookmarked } = req.body;
    const activity = activityId;
    console.log(activity, isBookmarked);
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
    }

    const updatedBookmark = await Bookmark.findOneAndUpdate(query, update, {
      new: true,
    });

    if (updatedBookmark !== null) {
      res.status(200).json(updatedBookmark);
    } else {
      let bookmark;

      if (activity) {
        bookmark = new Bookmark({
          activity,
          isBookmarked,
          type: BookmarkEnum.ACTIVITY,
          client: client._id,
        });
      }

      const bookmarkDoc = await bookmark.save();

      res.status(200).json(bookmarkDoc);
    }
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

export const getVendorBookmark = async (req, res) => {
  try {
    const client = req.user;
    const { vendorId } = req.params;

    const bookmark = await Bookmark.findOne({
      vendor: vendorId,
      client: client._id,
    });

    res.status(200).json(bookmark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateVendorBookmark = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { isBookmarked } = req.body;

    const vendor = vendorId;
    const client = req.user;
    let update = {
      isBookmarked,
      updated: Date.now(),
      vendor: vendor,
    };

    let query = {
      client: client._id,
      vendor: vendor,
    };

    const updatedBookmark = await Bookmark.findOneAndUpdate(query, update, {
      new: true,
    });

    if (updatedBookmark !== null) {
      res.status(200).json(updatedBookmark);
    } else {
      let bookmark;
      if (vendor) {
        bookmark = new Bookmark({
          vendor,
          isBookmarked,
          type: BookmarkEnum.VENDOR,
          client: client._id,
        });
      }

      const bookmarkDoc = await bookmark.save();

      res.status(200).json(bookmarkDoc);
    }
  } catch (e) {
    console.error(e);
    return res.status(400).json({
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
