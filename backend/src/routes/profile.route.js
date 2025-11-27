import express from "express"
import {getProfileData} from "../controllers/profile.controller.js"
const router = express.Router()

router.get("/:id",getProfileData)
export default router