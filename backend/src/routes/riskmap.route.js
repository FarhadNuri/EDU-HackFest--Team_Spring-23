import express from "express"
import { getMockRiskMapData } from "../controllers/riskmap.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/mock-data", protectRoute, getMockRiskMapData)

export default router
