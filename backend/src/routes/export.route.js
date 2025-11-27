import express from "express";
import { exportCropsJSON, exportCropsCSV, exportProfileJSON } from "../controllers/export.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/crops/json", protectRoute, exportCropsJSON);
router.get("/crops/csv", protectRoute, exportCropsCSV);
router.get("/profile/json", protectRoute, exportProfileJSON);

export default router;
