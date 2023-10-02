import express from "express";
import { check } from "express-validator";
import { getActivitiesWithFilters } from "../../controller/activityController.js";
import { getAllThemes } from "../../controller/activityController.js";
import { getAllActivitiesNames } from "../../controller/activityController.js";
import { getMinAndMaxPricePerPax } from "../../controller/activityController.js";
const router = express.Router();

/*
Note: This file contains the /shop router
*/

router.get("/getAllThemes", getAllThemes);

router.post("/getFilteredActivities", getActivitiesWithFilters);

router.get("/getAllActivitiesNames", getAllActivitiesNames);

router.get("/getMinAndMaxPricePerPax", getMinAndMaxPricePerPax);
export default router;
