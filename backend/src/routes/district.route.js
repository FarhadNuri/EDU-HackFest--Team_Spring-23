import express from "express"
import { searchDistricts, getAllDistrictsAPI } from "../controllers/district.controller.js"

const router = express.Router()

router.get("/search", searchDistricts)
router.get("/all", getAllDistrictsAPI)

export default router
