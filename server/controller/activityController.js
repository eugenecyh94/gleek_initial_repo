import mongoose from "mongoose";
import ActivityModel from "../model/activityModel.js";
import ActivityPricingRulesModel from "../model/activityPricingRules.js";
import ApprovalStatusChangeLog from "../model/approvalStatusChangeLog.js";
import ThemeModel from "../model/themeModel.js";
import {
  findMinimumPricePerPax,
  getAllVendorActivities,
  prepareActivityMinimumPricePerPaxAndSingleImage,
} from "../service/activityService.js";
import { s3GetImages, s3RemoveImages } from "../service/s3ImageServices.js";
import { ActivityApprovalStatusEnum } from "../util/activityApprovalStatusEnum.js";
import { Role } from "../util/roleEnum.js";
import {
  NotificationAction,
  NotificationEvent,
} from "../util/notificationRelatedEnum.js";
import { createNotification } from "./notificationController.js";

// yt: this endpoint retrieves and returns PUBLISHED & PENDING APPROVAL activities only
export const getAllActivities = async (req, res) => {
  try {
    const activities = await ActivityModel.find()
      .populate("activityPricingRules")
      .populate("linkedVendor")
      .populate("theme")
      .populate("subtheme")
      .populate({
        path: "approvalStatusChangeLog",
        populate: { path: "admin", model: "Admin" },
      });
    const publishedActivities = activities.filter((row) => {
      return row.approvalStatus === "Published" && row.isDraft === false;
    });
    const pendingApprovalActivities = activities.filter((row) => {
      return row.approvalStatus === "Pending Approval" && row.isDraft === false;
    });
    res.status(200).json({
      publishedActivities,
      pendingApprovalActivities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// yt: this endpoint retrieves ALL activities (both drafts and published) for an admin
export const getAllActivitiesForAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const activities = await ActivityModel.find({ adminCreated: adminId })
      .populate({
        path: "adminCreated",
        match: { _id: adminId },
        select: "_id name",
      })
      .populate("activityPricingRules")
      .populate({
        path: "approvalStatusChangeLog",
        populate: { path: "admin", model: "Admin", select: "_id name" },
      })
      .populate("theme")
      .populate("subtheme")
      .populate({
        path: "linkedVendor",
        select: "-password",
      });
    res.status(200).json({
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPreSignedImgs = async (req, res) => {
  try {
    const foundActivity = await ActivityModel.findById(req.params.id).populate(
      "linkedVendor",
    );
    let preSignedUrlArr = await s3GetImages(foundActivity.images);
    let vendorProfile;
    if (foundActivity.linkedVendor.companyLogo) {
      vendorProfile = await s3GetImages(foundActivity.linkedVendor.companyLogo);
    } else {
      vendorProfile = null;
    }
    res.status(200).json({
      activityImages: preSignedUrlArr,
      vendorProfileImage: vendorProfile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivity = async (req, res) => {
  try {
    const foundActivity = await ActivityModel.findById(req.params.id)
      .populate("activityPricingRules")
      .populate("linkedVendor")
      .populate("theme")
      .populate("subtheme");
    let preSignedUrlArr = await s3GetImages(foundActivity.images);
    foundActivity.preSignedImages = preSignedUrlArr;
    console.log("each push:", foundActivity.preSignedImages);

    // Populate the minimum price per pax for each activity
    foundActivity.minimumPricePerPax =
      await findMinimumPricePerPax(foundActivity);
    if (foundActivity.linkedVendor && foundActivity.linkedVendor.companyLogo) {
      let preSignedUrl = await s3GetImages(
        foundActivity.linkedVendor.companyLogo,
      );
      foundActivity.linkedVendor.preSignedPhoto = preSignedUrl;
    }

    res.status(200).json({
      data: foundActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivitiesByVendorId = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const activities = await ActivityModel.find({
      linkedVendor: vendorId,
      approvalStatus: "Published",
    })
      .populate("activityPricingRules")
      .populate("theme")
      .populate("subtheme")
      .populate("linkedVendor");

    const preSignedPromises = activities.map(async (activity) => {
      await prepareActivityMinimumPricePerPaxAndSingleImage(activity);
    });

    await Promise.all(preSignedPromises);

    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const saveActivityPricingRules = async (
  activityPricingRules,
  session,
  savedActivity,
  validateBeforeSave,
) => {
  const activitypriceobjects = [];
  if (Array.isArray(activityPricingRules)) {
    for (const jsonString of activityPricingRules) {
      try {
        const pricingObject = JSON.parse(jsonString);

        const activitypriceobject = {
          start: pricingObject.start,
          end: pricingObject.end,
          pricePerPax: pricingObject.pricePerPax,
          clientPrice: pricingObject.clientPrice,
          activity: savedActivity._id,
        };
        activitypriceobjects.push(activitypriceobject);
      } catch (error) {
        throw new Error(`Error parsing activity pricing rules`);
      }
    }
  } else {
    console.log(activityPricingRules);
    const pricingObject = JSON.parse(activityPricingRules);

    const activitypriceobject = {
      start: pricingObject.start,
      end: pricingObject.end,
      pricePerPax: pricingObject.pricePerPax,
      clientPrice: pricingObject.clientPrice,
      activity: savedActivity._id,
    };
    activitypriceobjects.push(activitypriceobject);
  }
  await Promise.all(
    activitypriceobjects.map(async (pricingRule) => {
      try {
        const newPricingRule = await ActivityPricingRulesModel.create(
          [{ ...pricingRule }],
          {
            session,
            validateBeforeSave,
          },
        );
        await ActivityModel.findByIdAndUpdate(
          savedActivity._id,
          {
            $push: {
              activityPricingRules: newPricingRule[0]._id,
            },
          },
          { new: true, session },
        );
      } catch (error) {
        throw new Error("Error when creating activity pricing rules!");
      }
    }),
  );
};

const saveApprovalStatusChangeLog = async (
  approvalStatus,
  rejectionReason,
  activityId,
  adminId,
  session,
) => {
  try {
    const newChangeLogEntry = new ApprovalStatusChangeLog({
      approvalStatus,
      date: Date.now(),
      rejectionReason,
      activity: activityId,
      admin: adminId,
    });
    const thing = await newChangeLogEntry.save({ session });
    return thing;
  } catch (error) {
    console.error("Error saving Change Log", error);
    throw new Error("Error saving Change Log");
  }
};

//yt: this endpoint is for when admin saves/edits/submits an activity draft
export const saveActivity = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("save activity body:", req.body);
    const {
      activityPricingRules,
      weekendPricing,
      onlinePricing,
      offlinePricing,
      activityId,
      title,
      description,
      location,
      approvalStatus,
      activityType,
      isFood,
      maxParticipants,
      minparticipants,
      clientMarkupPercentage,
      duration,
      theme,
      bookingNotice,
      startTime,
      endTime,
      capacity,
      dayAvailabilities,
      subtheme,
      sdg,
      popupItemsSold,
      foodCertDate,
      foodCategory,
      isFoodCertPending,
      linkedVendor,
      pendingCertificateType,
      updatedImageList,
      ...remainderActivity
    } = req.body;
    const parsedWeekend = JSON.parse(weekendPricing);
    const parsedOnline = JSON.parse(onlinePricing);
    const parsedOffline = JSON.parse(offlinePricing);
    const activity = {
      ...remainderActivity,
      title: title ?? null,
      description: description ?? null,
      location: location ?? [],
      approvalStatus,
      activityType: activityType ?? null,
      isFood: isFood ?? null,
      maxParticipants: maxParticipants ?? null,
      minparticipants: minparticipants ?? null,
      clientMarkupPercentage: clientMarkupPercentage ?? null,
      duration: duration ?? null,
      theme: theme ?? null,
      bookingNotice,
      startTime: startTime ?? null,
      endTime: endTime ?? null,
      capacity: capacity ?? null,
      dayAvailabilities: dayAvailabilities ?? [],
      subtheme: subtheme ?? [],
      sdg: sdg ?? [],
      popupItemsSold: popupItemsSold ?? null,
      foodCertDate: foodCertDate ?? null,
      foodCategory: foodCategory ?? [],
      isFoodCertPending: isFoodCertPending ?? null,
      linkedVendor: linkedVendor ?? req?.user?._id,
      pendingCertificateType: pendingCertificateType ?? null,
      modifiedDate: Date.now(),
    };

    console.log("linked vendor: ", req.user);

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
    let savedActivity;
    if (approvalStatus === "Rejected") {
      const foundActivity =
        await ActivityModel.findById(activityId).session(session);

      // this is a reject draft (child), update existing
      if (!foundActivity.rejectedDraft && foundActivity.parent) {
        const updatedRejectedDraft = await ActivityModel.findByIdAndUpdate(
          activityId,
          { ...activity, activityPricingRules: [] },
          {
            new: true,
            session,
          },
        );
        savedActivity = updatedRejectedDraft;
        await ActivityPricingRulesModel.deleteMany(
          { activity: activityId },
          { session },
        );
        // this is a parent, create a new reject draft (child)
      } else {
        const a = foundActivity.toObject();
        const thing = {
          ...a,
          ...activity,
        };
        const { _id, __v, ...rest } = thing;
        rest.parent = activityId;
        rest.activityPricingRules = [];
        const newActivity = new ActivityModel(rest);
        const rejectDraft = await newActivity.save({
          validateBeforeSave: false,
          session,
        });
        await ActivityModel.findByIdAndUpdate(
          activityId,
          { rejectedDraft: rejectDraft._id },
          {
            new: true,
            session,
          },
        );
        savedActivity = rejectDraft;
        console.log("New saved activity", savedActivity);
      }
      // submit
    } else if (activityId) {
      try {
        const foundActivity =
          await ActivityModel.findById(activityId).session(session);
        if (!foundActivity) {
          throw new Error(
            "Activity draft you are trying to save does not exist!",
          );
        } else {
          let parentId;
          // this is rejected draft
          if (!foundActivity.rejectedDraft && foundActivity.parent) {
            parentId = foundActivity.parent;
            await ActivityModel.findByIdAndDelete(foundActivity._id, {
              session,
            });
            // this is regular draft
          } else {
            parentId = activityId;
          }
          savedActivity = await ActivityModel.findByIdAndUpdate(
            parentId,
            {
              ...activity,
              activityPricingRules: [],
              rejectedDraft: null,
              parent: null,
            },
            {
              new: true,
              session,
            },
          );
          await ActivityPricingRulesModel.deleteMany(
            { activity: activityId },
            { session },
          );

          if (savedActivity.adminCreated === undefined) {
            console.log("activity is created by vendor::");

            req.notificationReq = {
              senderRole: Role.VENDOR,
              sender: savedActivity.linkedVendor,
              recipientRole: Role.ADMIN,
              notificationEvent: NotificationEvent.ACTIVITY,
              notificationAction: NotificationAction.APPROVE,
              eventId: activityId,
              eventObj: savedActivity,
            };

            await createNotification(req.notificationReq, session);
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "Error when trying to update activity draft",
          message: "Invalid activity Id!",
        });
      }
      // new draft -> straightaway submit
    } else {
      const newActivity = new ActivityModel({
        ...activity,
      });

      if (newActivity.isDraft === false) {
        console.log("This is a direct non draft submit");

        if (newActivity.adminCreated === undefined) {
          console.log("activity is created by vendor::");

          req.notificationReq = {
            senderRole: Role.VENDOR,
            sender: newActivity.linkedVendor,
            recipientRole: Role.ADMIN,
            notificationEvent: NotificationEvent.ACTIVITY,
            notificationAction: NotificationAction.APPROVE,
            eventObj: newActivity,
          };

          await createNotification(req.notificationReq, session);
        }
      }

      savedActivity = await newActivity.save({
        validateBeforeSave: false,
        session,
      });
    }

    console.log("Saved Activity is: ", savedActivity);

    const processedS3ImageUrlToBeKept = [];
    console.log("updatedImageList yoo", updatedImageList);

    if (updatedImageList !== undefined && updatedImageList.length > 0) {
      for (let i = 0; i < updatedImageList.length; i++) {
        processedS3ImageUrlToBeKept.push(updatedImageList[i].split("?")[0]);
      }
    }

    const srcS3ToBeKeptImageList = savedActivity.images.filter((item) =>
      processedS3ImageUrlToBeKept.includes(item),
    );
    const srcS3ToBeRemovedImageList = savedActivity.images.filter(
      (item) => !processedS3ImageUrlToBeKept.includes(item),
    );

    const fileBody = req.files;
    const imagesPathArr = [];

    if (fileBody.length !== 0 || fileBody.length !== undefined) {
      await s3RemoveImages(srcS3ToBeRemovedImageList);
    }

    if (fileBody.length === 0 || fileBody.length === undefined) {
      console.log("No image files uploaded");
    } else {
      let fileArray = req.files,
        fileLocation;
      for (let i = 0; i < fileArray.length; i++) {
        fileLocation = fileArray[i].location;
        imagesPathArr.push(fileLocation);
      }
    }

    for (let i = 0; i < imagesPathArr.length; i++) {
      srcS3ToBeKeptImageList.push(imagesPathArr[i]);
    }

    await ActivityModel.findByIdAndUpdate(
      savedActivity._id,
      { images: srcS3ToBeKeptImageList },
      { new: true, session },
    );

    if (activityPricingRules) {
      await saveActivityPricingRules(
        activityPricingRules,
        session,
        savedActivity,
        false,
      );
    }

    await session.commitTransaction();
    res.status(201).json({
      message: "Activity draft saved successfully",
      activity: savedActivity,
    });
  } catch (error) {
    console.log("Error caught", error);
    await session.abortTransaction();
    res
      .status(500)
      .json({ error: "Activity cannot be added", message: error.message });
  } finally {
    session.endSession();
  }
};

export const approveActivity = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("approve activity body:", req.params.activityId, req.body);
    const { activityId } = req.params;
    const { adminId, markup } = req.body;

    const approvalStatusChangeLog = await saveApprovalStatusChangeLog(
      ActivityApprovalStatusEnum.READY_TO_PUBLISH,
      null,
      activityId,
      adminId,
      session,
    );

    const savedActivity = await ActivityModel.findByIdAndUpdate(
      activityId,
      {
        approvalStatus: ActivityApprovalStatusEnum.READY_TO_PUBLISH,
        clientMarkupPercentage: markup,
        approvedDate: Date.now(),
        $push: {
          approvalStatusChangeLog: approvalStatusChangeLog._id,
        },
      },
      {
        new: true,
        session,
      },
    );
    for (const ruleId of savedActivity.activityPricingRules) {
      try {
        const rule =
          await ActivityPricingRulesModel.findById(ruleId).session(session);
        if (!rule) {
          throw new Error(`Pricing rule not found for ruleId: ${ruleId}`);
        }
        const { pricePerPax } = rule;
        const clientPrice = Math.ceil(
          parseFloat(pricePerPax) * (parseFloat(markup) / 100) +
            parseFloat(pricePerPax),
        );

        const updatedRule = await ActivityPricingRulesModel.findByIdAndUpdate(
          ruleId,
          { clientPrice },
          { new: true, session },
        );
      } catch (error) {
        throw new Error(`Error processing ruleId: ${ruleId}`, error);
      }
    }

    await session.commitTransaction();

    res.status(201).json({
      message: `${savedActivity.title} Activity approved successfully`,
      activity: savedActivity,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      error: "Unexpected Server Error occured!",
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const rejectActivity = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("reject activity body:", req.params.activityId);
    const { activityId } = req.params;
    const { rejectionReason, adminId } = req.body;

    const approvalStatusChangeLog = await saveApprovalStatusChangeLog(
      ActivityApprovalStatusEnum.REJECTED,
      rejectionReason,
      activityId,
      adminId,
      session,
    );

    const savedActivity = await ActivityModel.findByIdAndUpdate(
      activityId,
      {
        approvalStatus: ActivityApprovalStatusEnum.REJECTED,
        rejectionReason,
        $push: {
          approvalStatusChangeLog: approvalStatusChangeLog._id,
        },
      },
      {
        new: true,
        session,
      },
    );

    await session.commitTransaction();

    res.status(201).json({
      message: `${savedActivity.title} rejected successfully`,
      activity: savedActivity,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      error: "Unexpected Server Error occured!",
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const publishActivity = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("publish activity body:", req.params.id);
    const { id } = req.params;

    const savedActivity = await ActivityModel.findByIdAndUpdate(
      id,
      {
        approvalStatus: ActivityApprovalStatusEnum.PUBLISHED,
        createdDate: Date.now(),
      },
      {
        new: true,
        session,
      },
    )
      .populate({
        path: "approvalStatusChangeLog",
        populate: { path: "admin", model: "Admin", select: "_id name" },
      })
      .populate("activityPricingRules")
      .populate("theme")
      .populate("subtheme");

    console.log("savedActivity", savedActivity);

    await session.commitTransaction();

    res.status(201).json({
      message: `${savedActivity.title} published successfully`,
      activity: savedActivity,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      error: "Unexpected Server Error occured!",
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const deleteActivityDraft = async (req, res) => {
  try {
    const activityId = req.params.id;
    const deletedActivity = await ActivityModel.findByIdAndDelete(activityId);
    await ActivityPricingRulesModel.deleteMany(
      { activity: activityId },
      { session },
    );
    let activities;
    if (deletedActivity.adminCreated) {
      activities = await retrieveActivities(deletedActivity.adminCreated);
    } else {
      if (deletedActivity.parent) {
        const parentId = deletedActivity.parent;
        const newParent = await ActivityModel.findByIdAndUpdate(
          parentId,
          {
            rejectedDraft: null,
          },
          { new: true },
        );
        console.log("new parent", newParent);
      }

      console.log("Retrieving all vendor activities", req.user);
      activities = await getAllVendorActivities(req.user._id);
    }
    res.status(201).json({
      message: "Activity draft deleted successfully!",
      activity: activities,
    });
  } catch (e) {
    console.error("error when deleting draft", e);
    res.status(500).json({
      error: "Error when deleting activity draft!",
      message: e.message,
    });
  }
};

export const bulkDeleteActivityDraft = async (req, res) => {
  try {
    console.log("bulkDeleteActivityDraft", req.body);
    const activityIds = req.body;
    const deletedActivity = await ActivityModel.findOne({ _id: activityIds });
    const activitiesToDelete = await ActivityModel.find({
      _id: { $in: activityIds },
    });
    const { deletedCount } = await ActivityModel.deleteMany({
      _id: activityIds,
    });
    const thing = await ActivityPricingRulesModel.find({
      activity: { $in: activityIds },
    });
    const ting = await ActivityPricingRulesModel.deleteMany({
      activity: { $in: activityIds },
    });
    let activities;
    if (deletedActivity.adminCreated) {
      activities = await retrieveActivities(deletedActivity.adminCreated);
    } else {
      activitiesToDelete.forEach(async (deletedActivity) => {
        if (deletedActivity.parent) {
          const parentId = deletedActivity.parent;
          await ActivityModel.findByIdAndUpdate(
            parentId,
            {
              rejectedDraft: null,
            },
            { new: true },
          );
        }
      });
      activities = await getAllVendorActivities(req.user._id);
    }

    res.status(201).json({
      message: `Deleted ${deletedCount} Activity${
        deletedCount > 1 ? " Drafts" : " Draft"
      } successfully!`,
      activity: activities,
    });
  } catch (e) {
    res.status(500).json({
      error: "Error when bulk deleting activity drafts!",
      message: e.message,
    });
  }
};

const retrieveActivities = async (adminId) => {
  return await ActivityModel.find()
    .populate({
      path: "adminCreated",
      match: { _id: adminId },
    })
    .populate("activityPricingRules")
    .populate("theme")
    .populate("subtheme")
    .populate("linkedVendor")
    .populate({
      path: "approvalStatusChangeLog",
      populate: { path: "admin", model: "Admin", select: "_id name" },
    });
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

    // Initialize the query
    const query = {};

    if (searchValue != null && searchValue.length > 0) {
      // If searchValue is provided, add title search to the query
      query.title = {
        $regex: new RegExp(searchValue, "i"), // "i" makes the regex case-insensitive
      };
      console.log(searchValue);
    }

    if (filter.locations.length > 0) {
      // Add location filter when locations is not empty
      query.location = {
        $in: filter.locations,
      };
    }

    // Convert string IDs to ObjectId instances
    const subthemeIds = filter.themes.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

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

    if (filter.priceRange[0] !== null && filter.priceRange[1] !== null) {
      const pricingRules = await ActivityPricingRulesModel.find({
        clientPrice: {
          $gte: filter.priceRange[0], // Greater than or equal to minPrice
          $lte: filter.priceRange[1], // Less than or equal to maxPrice
        },
      });
      const pricingRuleIds = pricingRules.map((rule) => rule._id);
      query.activityPricingRules = {
        $in: pricingRuleIds,
      };
    }

    // Add the condition activities on client
    query.isDraft = false;
    query.disabled = false;
    query.approvalStatus = "Published";

    const activities = await ActivityModel.find(query)
      .populate("activityPricingRules")
      .populate("linkedVendor");

    // Create a function to find the minimum price per pax for each activity
    async function findMinimumPricePerPax(activity) {
      let minPricePerPax = Infinity;
      for (const pricingRule of activity.activityPricingRules) {
        if (pricingRule.clientPrice < minPricePerPax) {
          minPricePerPax = pricingRule.clientPrice;
        }
      }
      return minPricePerPax;
    }

    // Populate the minimum price per pax for each activity
    for (const activity of activities) {
      activity.minimumPricePerPax = await findMinimumPricePerPax(activity);
      activity.preSignedImages = await s3GetImages(activity.images);
    }
    // console.log(
    //   "********************************************************************************"
    // );
    // console.log(activities);

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
    const activityTitles = await ActivityModel.find(
      { isDraft: false },
      "title",
    );

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

export const getMinAndMaxPricePerPax = async (req, res) => {
  try {
    const activities = await ActivityModel.find({}).populate(
      "activityPricingRules",
    );
    if (activities.length === 0) {
      return res.status(200).send({
        success: true,
        msg: "No activities found!",
        minPrice: null,
        maxPrice: null,
      });
    }

    const pricingRules = activities.flatMap(
      (activity) => activity.activityPricingRules,
    );

    if (pricingRules.length === 0) {
      return res.status(200).send({
        success: true,
        msg: "No pricing rules found!",
        minPrice: null,
        maxPrice: null,
      });
    }

    const minPrice = Math.min(...pricingRules.map((rule) => rule.clientPrice));
    const maxPrice = Math.max(...pricingRules.map((rule) => rule.clientPrice));

    // console.log("Minimum Price Per Pax:", minPrice);
    // console.log("Maximum Price Per Pax:", maxPrice);

    res.status(200).json({
      success: true,
      message: "Maximum and minimum prices fetched!",
      minPrice: minPrice,
      maxPrice: maxPrice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

/**
 * App: Gleek Vendor
 * Retrieve activities associated with a vendor.
 *
 */

export const getVendorActivities = async (req, res) => {
  try {
    const vendor = req.user;
    const vendorId = vendor._id;
    console.log("getVendorActivities vendor _id", vendorId);

    const activities = await getAllVendorActivities(vendorId);
    const preSignedPromises = activities.map(async (activity) => {
      await findMinimumPricePerPax(activity);
    });

    await Promise.all(preSignedPromises);

    res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getActivityTitle = async (req, res) => {
  try {
    const foundActivity = await ActivityModel.findById(
      req.params.activityId,
      "title",
    );

    if (!foundActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(foundActivity.title);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
