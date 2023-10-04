import TestActivityModel from "../model/testactivityModel.js";
import express from "express";
import { uploadS3ActivityImages } from "../middleware/multer.js";
import { s3GetImages, s3RemoveImages } from "../service/s3ImageServices.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    let activities = await TestActivityModel.find().exec();

    for (let i = 0; i < activities.length; i++) {
      let preSignedUrlArr = await s3GetImages(activities[i].images);
      activities[i].preSignedImages = preSignedUrlArr;
      console.log("each push:", activities[i].preSignedImages);
    }
    console.log("res activity info all:", activities);

    res.status(200).json({
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/create",
  uploadS3ActivityImages.array("images", 5),
  async (req, res) => {
    try {
      const { activityName } = req.body;
      const newActivity = new TestActivityModel({
        activityName: activityName,
      });
      const createdActivity = await newActivity.save();
      const createdActivityId = createdActivity._id;
      console.log("activity created id::", createdActivityId);

      const fileBody = req.files;
      console.log("file body::", fileBody);

      const imagesPathArr = [];

      if (fileBody.length === 0 || fileBody.length === undefined) {
        console.log("uploadActivityImages Error: No File Selected!");
      } else {
        console.log("retrieving uploaded images url");
        let fileArray = req.files,
          fileLocation;
        for (let i = 0; i < fileArray.length; i++) {
          fileLocation = fileArray[i].location;
          console.log("file location::", fileLocation);
          imagesPathArr.push(fileLocation);
        }
      }

      for (let i = 0; i < imagesPathArr.length; i++) {
        console.log(imagesPathArr[i]);
      }

      const updatedActivity = await TestActivityModel.findByIdAndUpdate(
        { _id: createdActivity._id },
        { images: imagesPathArr },
        { new: true },
      );

      res.status(201).json({
        message: "Activity created successfully",
        data: updatedActivity,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Activity cannot be created", message: error.message });
    }
  },
);

router.patch(
  "/update",
  uploadS3ActivityImages.array("images", 5),
  async (req, res) => {
    try {
      const { activityId, updatedImageList } = req.body;
      const processedS3ImageUrlToBeKept = [];

      console.log("req body::", req.body);
      const existingActivity =
        await TestActivityModel.findById(activityId).exec();

      console.log(
        "existing activity src s3 image url::",
        existingActivity.images,
      );

      if (updatedImageList !== undefined && updatedImageList.length > 0) {
        for (let i = 0; i < updatedImageList.length; i++) {
          processedS3ImageUrlToBeKept.push(updatedImageList[0].split("?")[0]);
        }
      }
      console.log(
        "processed s3 url from frontend::",
        processedS3ImageUrlToBeKept,
      );

      const srcS3ToBeKeptImageList = existingActivity.images.filter((item) =>
        processedS3ImageUrlToBeKept.includes(item),
      );
      const srcS3ToBeRemovedImageList = existingActivity.images.filter(
        (item) => !processedS3ImageUrlToBeKept.includes(item),
      );

      console.log("s3 images from src to be kept::", srcS3ToBeKeptImageList);
      console.log(
        "s3 images from src to be removed:",
        srcS3ToBeRemovedImageList,
      );

      const fileBody = req.files;
      const imagesPathArr = [];

      if (fileBody.length !== 0 || fileBody.length !== undefined) {
        await s3RemoveImages(srcS3ToBeRemovedImageList);
      }

      if (fileBody.length === 0 || fileBody.length === undefined) {
        console.log("No image uploaded");
      } else {
        console.log("retrieving uploaded images url");
        let fileArray = req.files,
          fileLocation;
        for (let i = 0; i < fileArray.length; i++) {
          fileLocation = fileArray[i].location;
          console.log("file location::", fileLocation);
          imagesPathArr.push(fileLocation);
        }
      }

      for (let i = 0; i < imagesPathArr.length; i++) {
        console.log(imagesPathArr[i]);
        srcS3ToBeKeptImageList.push(imagesPathArr[i]);
      }

      console.log("final s3 images url::", srcS3ToBeKeptImageList);

      const updatedActivity = await TestActivityModel.findByIdAndUpdate(
        { _id: activityId },
        { images: srcS3ToBeKeptImageList },
        { new: true },
      );

      res.status(201).json({
        message: "Activity created successfully",
        data: srcS3ToBeKeptImageList,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Activity cannot be created", message: error.message });
    }
  },
);

export default router;
