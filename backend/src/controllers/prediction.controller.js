import User from "../models/auth.model.js";
import Crop from "../models/crop.model.js";
import { generateMockSensorData,calculateETCL, generateRiskSummary, getWeatherForPrediction, processForecastData,generateMockWeatherForecast } from "../lib/prediction.lib.js";
import { redis } from "../lib/redis.lib.js";


export async function getCropPrediction(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        
        const { cropId } = req.params;

        const crop = await Crop.findOne({ _id: cropId, farmerId: req.user.userId });
        if (!crop) {
            return res.status(404).json({ success: false, message: "Crop not found" });
        }

        const user = await User.findById(req.user.userId).select('latitude longitude district');
        if (!user || !user.latitude || !user.longitude) {
            return res.status(400).json({ 
                success: false, 
                message: "Location not set. Please update your profile with district." 
            });
        }

        const sensorData = generateMockSensorData(cropId, 7);
     
        const weatherForecast = await getWeatherForPrediction(user);
 
        const prediction = calculateETCL(sensorData, weatherForecast, crop.storageType, cropId);
   
        const riskSummary = generateRiskSummary(prediction, weatherForecast, crop.cropType);
        
        return res.status(200).json({
            success: true,
            crop: {
                id: crop._id,
                type: crop.cropType,
                weight: crop.weight,
                storageType: crop.storageType,
                harvestDate: crop.harvestDate,
                storageLocation: crop.storageLocation
            },
            prediction: {
                etcl: prediction.etcl,
                riskLevel: prediction.riskLevel,
                riskScore: prediction.riskScore,
                currentConditions: prediction.currentConditions,
                riskFactors: prediction.factors
            },
            weatherImpact: {
                location: user.district,
                forecast: weatherForecast.slice(0, 3),
                highRiskDays: weatherForecast.filter(day => 
                    day.rainChance > 60 || day.humidity > 80 || day.tempMax > 35
                ).length
            },
            summary: riskSummary.summary,
            recommendations: riskSummary.recommendations,
            timeframe: riskSummary.timeframe,
            generatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error in getCropPrediction:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error"
        });
    }
}


export async function getAllCropPredictions(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        

        const crops = await Crop.find({ farmerId: req.user.userId });
        if (crops.length === 0) {
            return res.status(200).json({ 
                success: true, 
                predictions: [],
                message: "No crops registered" 
            });
        }
        
        const user = await User.findById(req.user.userId).select('latitude longitude district');
        if (!user || !user.latitude || !user.longitude) {
            return res.status(400).json({ 
                success: false, 
                message: "Location not set. Please update your profile with district." 
            });
        }
        

        const weatherForecast = await getWeatherForPrediction(user);
        
        const predictions = [];
        let totalHighRisk = 0;
        
    
        const batchSize = 10;
        for (let i = 0; i < crops.length; i += batchSize) {
            const batch = crops.slice(i, i + batchSize);
            
            const batchPredictions = await Promise.all(batch.map(async (crop) => {
               
                const sensorData = generateMockSensorData(crop._id, 7);
    
                const prediction = calculateETCL(sensorData, weatherForecast, crop.storageType, crop._id);
                
               
                const riskSummary = generateRiskSummary(prediction, weatherForecast, crop.cropType);
                
                if (['Critical', 'High'].includes(prediction.riskLevel)) {
                    totalHighRisk++;
                }
                
                return {
                    crop: {
                        id: crop._id,
                        type: crop.cropType,
                        weight: crop.weight,
                        storageType: crop.storageType,
                        storageLocation: crop.storageLocation
                    },
                    etcl: prediction.etcl,
                    riskLevel: prediction.riskLevel,
                    riskScore: prediction.riskScore,
                    summary: riskSummary.summary,
                    timeframe: riskSummary.timeframe,
                    priority: prediction.riskLevel === 'Critical' ? 1 : 
                             prediction.riskLevel === 'High' ? 2 : 
                             prediction.riskLevel === 'Medium' ? 3 : 4
                };
            }));
            
            predictions.push(...batchPredictions);
        }
        
 
        predictions.sort((a, b) => a.priority - b.priority);
        
        return res.status(200).json({
            success: true,
            predictions,
            summary: {
                totalCrops: crops.length,
                highRiskCrops: totalHighRisk,
                location: user.district,
                weatherCondition: weatherForecast[0]?.condition || 'Unknown'
            },
            generatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error in getAllCropPredictions:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}


export async function getCropAnalytics(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        
        const { cropId } = req.params;
        const { days = 7 } = req.query;
        
        const crop = await Crop.findOne({ _id: cropId, farmerId: req.user.userId });
        if (!crop) {
            return res.status(404).json({ success: false, message: "Crop not found" });
        }
        
  
        const sensorData = generateMockSensorData(cropId, parseInt(days));
        
     
        const analyticsCacheKey = `analytics:${cropId}:${days}`;
        let dailyTrends = [];
        
        try {
            const cachedAnalytics = await redis.get(analyticsCacheKey);
            if (cachedAnalytics) {
                const analyticsData = JSON.parse(cachedAnalytics);
                dailyTrends = analyticsData.trends;
            } else {
               
                const dayMs = 24 * 60 * 60 * 1000;
                
                for (let i = 0; i < days; i++) {
                    const dayStart = Date.now() - (days - i - 1) * dayMs;
                    const dayEnd = dayStart + dayMs;
                    

                    let tempSum = 0, moistureSum = 0, humiditySum = 0, count = 0;
                    
                    for (const reading of sensorData) {
                        const readingTime = new Date(reading.timestamp).getTime();
                        if (readingTime >= dayStart && readingTime < dayEnd) {
                            tempSum += reading.temperature;
                            moistureSum += reading.moisture;
                            humiditySum += reading.humidity;
                            count++;
                        }
                    }
                    
                    if (count > 0) {
                        const avgTemp = tempSum / count;
                        const avgMoisture = moistureSum / count;
                        const avgHumidity = humiditySum / count;
                        
                        const riskScore = (avgTemp > 30 ? 30 : 0) + 
                                        (avgMoisture > 18 ? 35 : 0) + 
                                        (avgHumidity > 75 ? 25 : 0);
                        
                        dailyTrends.push({
                            date: new Date(dayStart).toISOString().split('T')[0],
                            temperature: parseFloat(avgTemp.toFixed(1)),
                            moisture: parseFloat(avgMoisture.toFixed(1)),
                            humidity: parseFloat(avgHumidity.toFixed(1)),
                            riskScore: Math.round(riskScore)
                        });
                    }
                }
                

                await redis.set(analyticsCacheKey, JSON.stringify({
                    trends: dailyTrends,
                    cached: Date.now()
                }), 'EX', 3600);
            }
        } catch (error) {
            console.warn('Analytics caching failed:', error.message);
            dailyTrends = []; 
        }
        

        let tempSum = 0, moistureSum = 0, humiditySum = 0;
        for (const reading of sensorData) {
            tempSum += reading.temperature;
            moistureSum += reading.moisture;
            humiditySum += reading.humidity;
        }
        
        const sensorCount = sensorData.length;
        
        return res.status(200).json({
            success: true,
            crop: {
                id: crop._id,
                type: crop.cropType,
                weight: crop.weight,
                storageType: crop.storageType,
                harvestDate: crop.harvestDate,
                storageLocation: crop.storageLocation
            },
            analytics: {
                period: `${days} days`,
                dailyTrends,
                sensorReadings: sensorCount,
                averages: {
                    temperature: parseFloat((tempSum / sensorCount).toFixed(1)),
                    moisture: parseFloat((moistureSum / sensorCount).toFixed(1)),
                    humidity: parseFloat((humiditySum / sensorCount).toFixed(1))
                }
            },
            generatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error in getCropAnalytics:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}


export function clearPredictionCaches() {
    etclCache.clear();
    sensorDataCache.clear();
    console.log('Prediction caches cleared');
}

export function getCacheStats() {
    return {
        etclCacheSize: etclCache.size,
        sensorDataCacheSize: sensorDataCache.size,
        timestamp: new Date().toISOString()
    };
}


export function cleanupExpiredCaches() {
    const now = Date.now();
    

    for (const [key, value] of etclCache.entries()) {
        if (now - value.timestamp > 300000) {
            etclCache.delete(key);
        }
    }
    

    for (const [key, value] of sensorDataCache.entries()) {
        if (now - value.timestamp > 600000) {
            sensorDataCache.delete(key);
        }
    }
    
    console.log(`Cache cleanup completed: ETCL=${etclCache.size}, Sensor=${sensorDataCache.size}`);
}