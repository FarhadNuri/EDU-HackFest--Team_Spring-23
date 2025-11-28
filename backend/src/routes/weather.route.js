import express from "express";
import { getWeatherForecast, getWeatherAdvisory, getDistricts, updateUserLocation } from "../controllers/weather.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/forecast", protectRoute, getWeatherForecast);
router.get("/advisory", protectRoute, getWeatherAdvisory);
router.get("/districts", getDistricts);
router.put("/location", protectRoute, updateUserLocation);

export default router;
