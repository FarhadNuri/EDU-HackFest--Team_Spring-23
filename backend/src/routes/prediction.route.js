import express from "express";
import { getCropPrediction, getAllCropPredictions, getCropAnalytics,clearPredictionCaches,getCacheStats } from "../controllers/prediction.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.get("/crop/:cropId", getCropPrediction);
router.get("/all", getAllCropPredictions);
router.get("/analytics/:cropId", getCropAnalytics);

// Cache management routes (optional - for debugging/monitoring)
router.get("/cache/stats", (req, res) => {
    res.json({ success: true, cache: getCacheStats() });
});
router.post("/cache/clear", (req, res) => {
    clearPredictionCaches();
    res.json({ success: true, message: "Prediction caches cleared" });
});

export default router;