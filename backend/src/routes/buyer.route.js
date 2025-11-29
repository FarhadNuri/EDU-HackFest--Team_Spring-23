import express from "express"
import { searchFarmers, getFarmerDetails, getBuyerProfile } from "../controllers/buyer.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/farmers/search", searchFarmers)
router.get("/farmers/:farmerId", getFarmerDetails)
router.get("/profile", protectRoute, getBuyerProfile)

export default router
