import express from "express";
import { check } from "express-validator";
import {
   getActivitiesWithFilters,
   getQuotationPdf,
   getQuotationPdfUrl,
} from "../../controller/activityController.js";
import { getAllThemes } from "../../controller/activityController.js";
import { getAllActivitiesNames } from "../../controller/activityController.js";
import { getMinAndMaxPricePerPax } from "../../controller/activityController.js";
import { verifyToken } from "../../middleware/clientAuth.js";
import { getActivity } from "../../controller/activityController.js";
const router = express.Router();

/*
Note: This file contains the /shop router
*/

router.get("/getAllThemes", verifyToken, getAllThemes);

router.post("/getFilteredActivities", verifyToken, getActivitiesWithFilters);

router.get("/getAllActivitiesNames", verifyToken, getAllActivitiesNames);

router.get("/getMinAndMaxPricePerPax", verifyToken, getMinAndMaxPricePerPax);

router.get("/viewActivity/:id", verifyToken, getActivity);

router.post("/getQuotationPdfUrl", verifyToken, getQuotationPdfUrl);

router.get("/getQuotationPdf/:path", verifyToken, getQuotationPdf);
export default router;
