import express from "express"
import { generateSmartAlerts, generateCropAlert } from "../controllers/alert.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Generate alerts for all farmer's crops
router.get("/generate", protectRoute, generateSmartAlerts)

// Generate alert for specific crop
router.get("/crop/:cropId", protectRoute, generateCropAlert)

export default router
