import express from "express"
import {signUp, logIn, logOut} from "../controllers/auth.controller.js"
const router = express.Router()

router.post("/",signUp)
router.post("/",logIn)
router.post("/",logOut)

export default router