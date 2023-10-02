import express from "express";
import { check } from "express-validator";
import { getActivitiesWithFilters } from "../../controller/activityController.js";
import { getAllThemes } from "../../controller/activityController.js";
import { getAllActivitiesNames } from "../../controller/activityController.js";
import { getMinAndMaxPricePerPax } from "../../controller/activityController.js";
import { verifyToken } from "../../middleware/clientAuth.js";

const router = express.Router();

/*
Note: This file contains the /shop router
*/

router.get("/getAllThemes", verifyToken, getAllThemes);

router.post("/getFilteredActivities", verifyToken, getActivitiesWithFilters);

router.get("/getAllActivitiesNames", verifyToken, getAllActivitiesNames);

router.get("/getMinAndMaxPricePerPax", verifyToken, getMinAndMaxPricePerPax);
export default router;
