import TestActivityModel from "../model/testactivityModel.js";
import express from "express";
import { uploadS3ActivityImages } from "../middleware/multer.js";
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const activities = await TestActivityModel.find().exec();
    res.status(200).json({
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:activityId", async (req, res) => {
  try {
    const activity = await TestActivityModel.findById({
      _id: req.params.activityId,
    }).exec();
    if (activity) {
      return res.status(202).json({ data: activity });
    }

    return res.status(404).json({ error: "Activity does not exist" });
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
      //Validation logic to check avoid repeat activity names, can change validation type
      // const activityExists = await TestActivityModel.findOne({activityName});
      //
      // if (activityExists) {
      //   return res.status(400).json({
      //     message:
      //         "Title already exists for other activities, please use another title to create",
      //   });
      // }
      const newActivity = new TestActivityModel({
        activityName: activityName,
      });
      const createdActivity = await newActivity.save();
      const createdActivityId = createdActivity._id;
      console.log("activity created id::", createdActivityId);

      const fileBody = req.files;
      const stringBody = req.body;
      console.log("create req body::", stringBody);
      console.log("create file body::", fileBody);

      const imagesPathArr = [];

      if (fileBody.length === 0 || fileBody.length === undefined) {
        console.log("uploadActivityImages Error: No File Selected!");
        res.status(500).json({
          status: "fail",
          message: "Error: No File Selected",
        });
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

export default router;
