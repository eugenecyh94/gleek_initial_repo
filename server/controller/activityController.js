import ActivityModel from "../model/activityModel.js";
import express from "express";
const router = express.Router();

/**
 * Read all activities.
 * @route GET /activity/all
 * @returns {object} An object containing the count and list of movies.
 * @throws {Error} If an error occurs while retrieving the movies.
 */
router.get("/all", async (req, res) => {
  try {
    const activities = await ActivityModel.find({}).exec();
    res.status(200).json({
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Read an activity by its ID.
 * @route GET /activity/:activityId
 * @param {string} activityId - The ID of the activity to retrieve.
 * @returns {object} The activity object.
 * @throws {Error} If the activity is not found or an error occurs while retrieving it.
 */
router.get("/:activityId", async (req, res) => {
  try {
    const activity = await ActivityModel.findById({
      _id: req.params.activityId,
    }).exec();
    if (activity) {
      return res.status(202).json({ data: activity });
    }

    return res
      .status(404)
      .json({ error: "The activity you are looking doesn't exist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Add a new activity.
 * @route POST /activity/addActivity
 * @param {string} title - Title of activity
 * @param {string} description - Description of activity
 * @param {[{string}]} tags - Consist of respective tags as per requirement
 * @param {number} price - The price of activity per pax
 * @returns {string} A success message if the activity is added successfully.
 * @throws {Error} If the activity already exists, an error occurs while saving the activity, or validation fails.
 */
// TODO - To be tested.
// TODO - Update pricing logic and image persisting logic
router.post("/add", async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, tags, price, image } = req.body;
    const { theme, type, duration, location, size } = tags;
    const activityExists = await ActivityModel.findOne({ title });

    if (activityExists) {
      return res.status(400).json({ message: "activity already exists" });
    }

    const newActivity = new ActivityModel({
      title,
      description,
      tags,
      price,
      image,
    });

    await newActivity.save();

    res.status(201).json({ message: "activity added successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to add activity", message: error.message });
  }
});

/**
 * Update an activity by its ID.
 * @route PATCH /activity/update/activityId
 * @param {string} activityId - The ID of the activity to update.
 * @returns {object} A success message and the updated activity object.
 * @throws {Error} If the activity is not found, an error occurs while updating it, or validation fails.
 */
// TODO - To be tested.
router.patch("/update/:activityId", async (req, res) => {
  try {
    const updatedActivity = await ActivityModel.findByIdAndUpdate(
      { _id: req.params.activityId },
      req.body,
      { new: true },
    );
    res
      .status(200)
      .json({ msg: "activity updated successfully", updatedActivity });
  } catch (err) {
    res.status(500).json({ err: `Something went wrong: ${err}` });
  }
});

export default router;
