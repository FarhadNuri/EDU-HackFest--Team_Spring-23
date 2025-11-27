import express from "express";
import { syncOfflineData } from "../controllers/sync.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/offline", protectRoute, syncOfflineData);

export default router;
