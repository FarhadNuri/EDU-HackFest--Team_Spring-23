import express from "express"
import { langSwitch, getLang } from "../controllers/lang.controller.js"
const router = express.Router()


router.get("/", getLang)
router.put("/", langSwitch)

export default router