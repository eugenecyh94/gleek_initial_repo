import ActivityModel from "../model/activityModel.js";
import ActivityPricingRulesModel from "../model/activityPricingRules.js";
import ThemeModel from "../model/themeModel.js";
import { s3ImageGetService } from "../service/s3ImageGetService.js";
import { VendorTypeEnum } from "../util/vendorTypeEnum.js";
import mongoose from "mongoose";

export const getAllActivities = async (req, res) => {
  try {
    const activities = await ActivityModel.find()
      .populate("activityPricingRules")
      .populate("theme")
      .populate("subtheme");
    res.status(200).json({
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivity = async (req, res) => {
  try {
    const foundActivity = await ActivityModel.findById(req.params.id)
      .populate("activityPricingRules")
      .populate("linkedVendor")
      .populate("theme")
      .populate("subtheme");
    let preSignedUrlArr = await s3ImageGetService(foundActivity.images);
    foundActivity.preSignedImages = preSignedUrlArr;
    console.log("each push:", foundActivity.preSignedImages);
    res.status(200).json({
      data: foundActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addActivity = async (req, res) => {
  try {
    console.log("add activity body:", req.body);
    const {
      activityPricingRules,
      weekendPricing,
      onlinePricing,
      offlinePricing,
      ...activity
    } = req.body;
    const parsedWeekend = JSON.parse(weekendPricing);
    const parsedOnline = JSON.parse(onlinePricing);
    const parsedOffline = JSON.parse(offlinePricing);

    activity["weekendPricing"] = {
      amount: parsedWeekend?.amount,
      isDiscount: parsedWeekend?.isDiscount,
    };
    activity["onlinePricing"] = {
      amount: parsedOnline?.amount,
      isDiscount: parsedOnline?.isDiscount,
    };
    activity["offlinePricing"] = {
      amount: parsedOffline?.amount,
      isDiscount: parsedOffline?.isDiscount,
    };
    const newActivity = new ActivityModel({ ...activity });
    const savedActivity = await newActivity.save();
    const imageFiles = req.files;

    //To update url of uploaded images path to s3 in created activity
    const imagesPathArr = [];

    if (imageFiles.length === 0 || imageFiles.length === undefined) {
      console.log("No image files uploaded");
    } else {
      console.log("Retrieving uploaded images url");
      let fileArray = req.files,
        fileLocation;
      for (let i = 0; i < fileArray.length; i++) {
        fileLocation = fileArray[i].location;
        console.log("file location:", fileLocation);
        imagesPathArr.push(fileLocation);
      }
    }

    await ActivityModel.findByIdAndUpdate(
      { _id: savedActivity._id },
      { images: imagesPathArr },
      { new: true }
    );

    const activitypriceobjects = [];
    if (Array.isArray(activityPricingRules)) {
      activityPricingRules.forEach((jsonString, index) => {
        try {
          const pricingObject = JSON.parse(jsonString);

          const activitypriceobject = {
            start: pricingObject.start,
            end: pricingObject.end,
            pricePerPax: pricingObject.pricePerPax,
            clientPrice: pricingObject.clientPrice,
          };
          activitypriceobjects.push(activitypriceobject);
        } catch (error) {
          console.error(`Error parsing JSON: ${error}`);
        }
      });
    } else {
      const pricingObject = JSON.parse(activityPricingRules);

      const activitypriceobject = {
        start: pricingObject.start,
        end: pricingObject.end,
        pricePerPax: pricingObject.pricePerPax,
        clientPrice: pricingObject.clientPrice,
      };
      activitypriceobjects.push(activitypriceobject);
    }

    activitypriceobjects.map(async (pricingRule) => {
      ActivityPricingRulesModel.create(pricingRule).then(
        async (newPricingRule) => {
          await ActivityModel.findByIdAndUpdate(
            savedActivity._id,
            {
              $push: {
                activityPricingRules: {
                  ...newPricingRule,
                },
              },
            },
            { new: true, useFindAndModify: false }
          );
        }
      );
    });

    res.status(201).json({
      message: "Activity added successfully",
      activity: savedActivity,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Activity cannot be added", message: error.message });
  }
};

export const bulkAddThemes = async (req, res) => {
  try {
    const { data } = req.body;
    processThemes(data)
      .then(() => {
        console.log("Themes added successfully");
        res.status(201).json({
          message: "Themes added successfully",
        });
      })
      .catch((err) => {
        console.error(err);
        res
          .status(500)
          .json({ err: "Themes cannot be added", message: err.message });
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Themes cannot be added", message: error.message });
  }
};

const processThemes = async (data) => {
  for (const { name, parent } of data) {
    let parentTheme = null;

    if (parent) {
      console.log(parent);
      parentTheme = await ThemeModel.findOne({ name: parent });
    }

    if (!parentTheme) {
      parentTheme = new ThemeModel({ name: parent });
      await parentTheme.save();
    }

    const childTheme = new ThemeModel({ name, parent: parentTheme });
    await childTheme.save();
  }
};

export const getAllThemes = async (req, res) => {
  try {
    const themes = await ThemeModel.find().populate("parent");

    const parentThemesWithChildren = {};

    themes.forEach((theme) => {
      const parentId = theme.parent ? theme.parent._id.toString() : null;

      if (!parentThemesWithChildren[parentId]) {
        parentThemesWithChildren[parentId] = {
          parent: theme.parent,
          children: [],
        };
      }

      parentThemesWithChildren[parentId].children.push(theme);
    });
    const parentThemes = Object.values(parentThemesWithChildren);
    res.status(200).json({
      data: parentThemes,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Themes cannot be added", message: error.message });
  }
};

export const getActivitiesWithFilters = async (req, res) => {
  try {
    const { filter, searchValue } = req.body;
    // Convert string IDs to ObjectId instances
    const subthemeIds = filter.themes.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    // Initialize the query
    const query = {};

    if (searchValue != null && searchValue.length > 0) {
      // If searchValue is provided, add title search to the query
      query.title = {
        $regex: new RegExp(searchValue, "i"), // "i" makes the regex case-insensitive
      };
    }

    if (filter.locations.length > 0) {
      // Add location filter when locations is not empty
      query.location = {
        $in: filter.locations,
      };
    }

    if (subthemeIds.length > 0) {
      // Add subtheme filter when subthemes is not empty
      query.subtheme = {
        $in: subthemeIds,
      };
    }

    if (filter.sgs.length > 0) {
      query.sdg = {
        $in: filter.sgs,
      };
    }

    if (filter.daysAvailability.length > 0) {
      query.dayAvailabilities = {
        $in: filter.daysAvailability,
      };
    }

    if (filter.activityType.length > 0) {
      query.activityType = {
        $in: filter.activityType,
      };
    }

    if (filter.duration.length > 0) {
      query.duration = {
        $in: filter.duration,
      };
    }

    const activities = await ActivityModel.find(query);

    console.log(activities);
    return res.status(200).json({
      success: true,
      message: "Filtered activities fetched!",
      activities: activities,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, msg: "Server error" });
  }
};

export const getAllActivitiesNames = async (req, res) => {
  try {
    // Query the collection to get titles of all documents
    const activityTitles = await ActivityModel.find({}, "title");

    // Extract the titles from the result
    const titles = activityTitles.map((activity) => activity.title);

    res.status(200).json({
      success: true,
      data: titles,
      message: "Activity titles fetched!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, msg: "Server error" });
  }
};
