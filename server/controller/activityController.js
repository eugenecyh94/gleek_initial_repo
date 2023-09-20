import ActivityModel from "../model/activityModel.js";
import ActivityPricingRulesModel from "../model/activityPricingRules.js";

export const getAllActivities = async (req, res) => {
  try {
    const activities = await ActivityModel.find().populate(
      "activityPricingRules",
    );
    res.status(200).json({
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActivity = async (req, res) => {
  try {
    const foundActivity = await ActivityModel.findById(req.params.id).populate(
      "activityPricingRules",
    );
    res.status(200).json({
      data: foundActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addActivity = async (req, res) => {
  try {
    const { activityPricingRules, ...activity } = req.body;
    const newActivity = new ActivityModel({ ...activity });
    const savedActivity = await newActivity.save();
    activityPricingRules.map(async (pricingRule) => {
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
            { new: true, useFindAndModify: false },
          );
        },
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

/**
 * Update an activity by its ID.
 * @route PATCH /activity/update/activityId
 * @param {string} activityId - The ID of the activity to update.
 * @returns {object} A success message and the updated activity object.
 * @throws {Error} If the activity is not found, an error occurs while updating it, or validation fails.
 */
// TODO - To be tested.
// router.patch("/update/:activityId", async (req, res) => {
//   try {
//     console.log("update req body::", req.body);
//     const { title, description, tags, price, image } = req.body;
//     const activityExists = await ActivityModel.findOne({ title });

//     if (activityExists) {
//       return res.status(400).json({
//         message:
//           "Title already exists for other activities, please use another title to update",
//       });
//     }

//     const updatedActivity = await ActivityModel.findByIdAndUpdate(
//       { _id: req.params.activityId },
//       req.body,
//       { new: true }
//     );

//     res
//       .status(200)
//       .json({ msg: "Activity updated successfully", data: updatedActivity });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Activity cannot be updated", message: error.message });
//   }
// });

/**
 * Delete a an activity by its ID.
 * @route DELETE /activity/delete/:activityId
 * @param {string} activityId - The ID of the activity to delete.
 * @returns {object} A success message and the deleted activity object.
 * @throws {Error} If the activity is not found or an error occurs while deleting them.
 */
// router.delete("/delete/:activityId", async (req, res) => {
//   try {
//     const deleteActivity = await ActivityModel.findByIdAndDelete(
//       req.params.activityId
//     );
//     res
//       .status(200)
//       .json({ msg: "Activity deleted successfully", data: deleteActivity });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ err: "Activity cannot be deleted", message: error.message });
//   }
// });
