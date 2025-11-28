import User from "../models/auth.model.js";
import Crop from "../models/crop.model.js";
import axios from "axios";
import { generateAdvisories } from "./advisory.controller.js";

export async function getWeatherForecast(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = await User.findById(req.user.userId).select('latitude longitude district');

        if (!user || !user.latitude || !user.longitude) {
            return res.status(400).json({ 
                success: false, 
                message: "Location not set. Please update your profile with district." 
            });
        }

        const cacheKey = `weather:${user.district}`;
        const { redis } = await import('../lib/redis.lib.js');
        
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log('Weather data served from cache for:', user.district);
            return res.status(200).json(JSON.parse(cached));
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ 
                success: false, 
                message: "Weather API key not configured" 
            });
        }

        console.log('Fetching fresh weather data from API for:', user.district);
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${user.latitude}&lon=${user.longitude}&appid=${apiKey}&units=metric&lang=en`;

        const response = await axios.get(url);

        if (!response.data) {
            return res.status(500).json({ 
                success: false, 
                message: "Failed to fetch weather data" 
            });
        }

        const dailyForecasts = processForecastData(response.data.list);

        const weatherData = {
            success: true,
            location: {
                district: user.district,
                lat: user.latitude,
                lon: user.longitude
            },
            forecast: dailyForecasts,
            fetchedAt: new Date().toISOString()
        };

        await redis.set(cacheKey, JSON.stringify(weatherData), 'EX', 14400);

        return res.status(200).json(weatherData);

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

function processForecastData(forecastList) {
    const dailyData = {};

    forecastList.forEach(item => {
        const date = item.dt_txt.split(' ')[0]; 

        if (!dailyData[date]) {
            dailyData[date] = {
                date: date,
                temps: [],
                humidity: [],
                rainProb: [],
                weather: [],
                windSpeed: []
            };
        }

        dailyData[date].temps.push(item.main.temp);
        dailyData[date].humidity.push(item.main.humidity);
        dailyData[date].rainProb.push((item.pop || 0) * 100); 
        dailyData[date].weather.push(item.weather[0]);
        dailyData[date].windSpeed.push(item.wind.speed);
    });

    
    return Object.keys(dailyData).slice(0, 7).map(date => {
        const day = dailyData[date];
        return {
            date: date,
            tempMax: Math.round(Math.max(...day.temps)),
            tempMin: Math.round(Math.min(...day.temps)),
            tempAvg: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length),
            humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
            rainChance: Math.round(Math.max(...day.rainProb)),
            windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length),
            condition: day.weather[0].main,
            description: day.weather[0].description,
            icon: day.weather[0].icon
        };
    });
}

export async function getWeatherAdvisory(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(req.user.userId).select('latitude longitude language');

        if (!user || !user.latitude || !user.longitude) {
            return res.status(400).json({ 
                success: false, 
                message: "Location not set" 
            });
        }

        const crops = await Crop.find({ farmerId: req.user.userId });

        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${user.latitude}&lon=${user.longitude}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const dailyForecasts = processForecastData(response.data.list);

        
        const advisories = generateAdvisories(dailyForecasts, user.language, crops);

        return res.status(200).json({
            success: true,
            advisories: advisories,
            language: user.language || 'en',
            cropsCount: crops.length
        });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getDistricts(req, res) {
    try {
        const { getAllDistricts } = await import('../lib/districts.lib.js');
        const districts = getAllDistricts();
        
        return res.status(200).json({
            success: true,
            districts: districts
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function updateUserLocation(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { district } = req.body;
        
        if (!district) {
            return res.status(400).json({ success: false, message: "District name required" });
        }

        const { getDistrictByName } = await import('../lib/districts.lib.js');
        const districtData = getDistrictByName(district);

        if (!districtData) {
            return res.status(404).json({ success: false, message: "District not found" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            {
                district: districtData.nameEn,
                latitude: districtData.latitude,
                longitude: districtData.longitude
            },
            { new: true }
        ).select('-password');

        return res.status(200).json({
            success: true,
            message: "Location updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
