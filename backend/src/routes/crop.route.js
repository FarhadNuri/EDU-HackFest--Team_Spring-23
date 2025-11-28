import express from "express"
import { cropBatchRegister, getCropCount, getAllCrops, getCropById } from "../controllers/crop.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post("/reg-batch", protectRoute, cropBatchRegister)
router.get("/count", protectRoute, getCropCount)
router.get("/list", protectRoute, getAllCrops)
router.get("/:id", protectRoute, getCropById)

export default router