import express from "express"
import { 
    cropBatchRegister, 
    getCropCount, 
    getAllCrops, 
    getCropById,
    updateCropStatus,
    getCropHistory,
    getAllSales
} from "../controllers/crop.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post("/reg-batch", protectRoute, cropBatchRegister)
router.get("/count", protectRoute, getCropCount)
router.get("/list", protectRoute, getAllCrops)
router.get("/sales", protectRoute, getAllSales)
router.get("/:id", protectRoute, getCropById)
router.post("/:id/status", protectRoute, updateCropStatus)
router.get("/:id/history", protectRoute, getCropHistory)

export default router