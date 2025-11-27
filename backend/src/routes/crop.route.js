import express from "express"
import { cropBatchRegister } from "../controllers/crop.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post("/reg-batch", protectRoute, cropBatchRegister)

export default router