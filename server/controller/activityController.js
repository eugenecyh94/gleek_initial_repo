import ActivityModel from "../model/activityModel.js";
import ActivityPricingRulesModel from "../model/activityPricingRules.js";
import ThemeModel from "../model/themeModel.js";

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
    console.log(parentThemesWithChildren);
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
