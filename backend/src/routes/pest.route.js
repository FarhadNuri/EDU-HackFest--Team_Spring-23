import express from "express"
import { identifyPest } from "../controllers/pest.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router()

// Identify pest from uploaded image
router.post("/identify", protectRoute, identifyPest)

export default router
