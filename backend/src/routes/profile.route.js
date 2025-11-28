import express from "express"
import {getProfileData, updateProfileData} from "../controllers/profile.controller.js"
const router = express.Router()

router.get("/:id",getProfileData)
router.put("/:id",updateProfileData)
export default router